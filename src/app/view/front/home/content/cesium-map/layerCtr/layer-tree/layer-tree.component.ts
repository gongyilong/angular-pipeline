import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServeService } from '../../../../../../../service/apis/serve.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommunicateService } from 'src/app/service/map/communicate/communicate.service';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { CesiumService } from 'src/app/helper/cesium/cesium.service';
import { ArcgisBaseService } from 'src/app/helper/arcgis/base.service';
declare var Cesium;

@Component({
  selector: 'app-layer-tree',
  templateUrl: './layer-tree.component.html',
  styleUrls: ['./layer-tree.component.css']
})
export class LayerTreeComponent implements OnInit {

  /********** 全局变量 **********/
  @Input() cview: any;
  @Output() isLayerShow = new EventEmitter<any>();
  tilesKeyAndIndex = [];
  gisKeyAndIndex = [];
  searchValue = '';
  windowStyle;
  windowStyle1 = { 'display': 'none' };
  windowStyle2 = { 'display': 'block' };
  isColse = true;
  isFold = true;
  isExpand = false;
  nodes = [];
  cNodes = [];
  activatedNode?: NzTreeNode;

  /********** 方法 **********/
  constructor(
    private serveService: ServeService,
    private message: NzMessageService,
    private communicateService: CommunicateService,
    private nzContextMenuService: NzContextMenuService,
    private cesiumService: CesiumService,
    private arcgisBaseService: ArcgisBaseService
  ) { }

  ngOnInit(): void {
    this.communicateService.cviewerOb.subscribe((cviewer) => {
      this.cview = cviewer;
    });
    this.serveService.getAllCServes()
      .subscribe((result) => {
        let dataArr = [];
        this.createTree(result.data, dataArr, 0);
        this.nodes = dataArr;
      });
  }

  /**
 * 1.判断点击的是否叶子节点
 * 2.如果是叶子节点，获取当前复选框状态，控制显隐；
 * 3.如果不是叶子节点，递归打开所有图层，不进行缩放；
 */
  nzCheckEvent(event: NzFormatEmitEvent): void {
    //局部变量
    let id = event.node.origin.key;
    this.cNodes = [];

    //判断是否叶子节点
    if (event.node.isLeaf) {
      //判断是显示还是隐藏
      if (event.node.origin.checked) {
        //显示
        if (this.tilesKeyAndIndex.findIndex(tile => tile.id === id) != -1 || this.gisKeyAndIndex.findIndex(tile => tile.id === id) != -1) {
          //已创建，仅显示
          if (event.node.origin.type === "3dtitles") {
            const index1 = this.tilesKeyAndIndex.findIndex(tile => tile.id === id);
            this.cview.scene.primitives.get(this.tilesKeyAndIndex[index1].idx).show = true;
            this.cview.flyTo(this.cview.scene.primitives.get(this.tilesKeyAndIndex[index1].idx));
          } else if (event.node.origin.type === "gis") {
            const gidx1 = this.gisKeyAndIndex.findIndex(tile => tile.id === id);
            this.cview.imageryLayers.get(this.gisKeyAndIndex[gidx1].idx).show = true;
            this.cview.flyTo(this.cview.imageryLayers.get(this.gisKeyAndIndex[gidx1].idx));
          }
        } else {
          //未创建，需要创建(按照类型)
          if (event.node.origin.type === "3dtitles") {
            //创建3dtitles
            this.tilesKeyAndIndex.push({ id: id, idx: this.cview.scene.primitives.length });
            this.cesiumService.create3DTiles(event.node.origin.url).then((tiles) => {
              this.cview.scene.primitives.add(tiles);
              this.cview.flyTo(tiles);
            })
          } else if (event.node.origin.type === "gis") {
            //创建gis图层
            this.serveService.getMapServeParam(event.node.origin.url + "?f=pjson").subscribe(
              data => {
                let rectangle = new Cesium.Rectangle.fromDegrees(data.fullExtent.xmin, data.fullExtent.ymin, data.fullExtent.xmax, data.fullExtent.ymax);
                this.gisKeyAndIndex.push({ id: id, idx: this.cview.imageryLayers.length });
                this.cesiumService.createArcGISLayer(event.node.origin.url, rectangle).then((layer) => {
                  this.cview.imageryLayers.add(layer);
                  this.cview.flyTo(layer);
                })
              }
            );
          }
        }
      } else {
        if (event.node.origin.type === "3dtitles") {
          const index2 = this.tilesKeyAndIndex.findIndex(tile => tile.id === event.node.origin.key);
          this.cview.scene.primitives.get(this.tilesKeyAndIndex[index2].idx).show = false;
        } else if (event.node.origin.type === "gis") {
          const gidx2 = this.gisKeyAndIndex.findIndex(tile => tile.id === event.node.origin.key);
          this.cview.imageryLayers.get(this.gisKeyAndIndex[gidx2].idx).show = false;
        }
        //关掉
      }
    } else {
      this.getLeafNode(event.node);
      // console.log(this.cNodes);
      //判断是要显示还是隐藏
      if (event.node.origin.checked) {
        //显示
        this.cNodes.forEach(leafN => {

          if (leafN.origin.type === "3dtitles") {
            if (this.tilesKeyAndIndex.findIndex(tile => tile.id === leafN.origin.key) != -1) {
              //已创建，仅显示
              const index3 = this.tilesKeyAndIndex.findIndex(tile => tile.id === leafN.origin.key);
              this.cview.scene.primitives.get(this.tilesKeyAndIndex[index3].idx).show = true;
              if (this.cNodes.length == 1) {
                this.cview.flyTo(this.cview.scene.primitives.get(this.tilesKeyAndIndex[index3].idx));
              }
            } else {
              //未创建，需要创建
              this.cesiumService.create3DTiles(leafN.origin.url).then((tiles) => {
                this.tilesKeyAndIndex.push({ id: leafN.origin.key, idx: this.cview.scene.primitives.length });
                this.cview.scene.primitives.add(tiles);
                if (this.cNodes.length == 1) {
                  this.cview.flyTo(tiles);
                }
              })
            }
          } else if (leafN.origin.type === "gis") {
            if (this.gisKeyAndIndex.findIndex(tile => tile.id === leafN.origin.key) != -1) {
              //已创建，仅显示
              const gidx3 = this.gisKeyAndIndex.findIndex(tile => tile.id === leafN.origin.key);
              this.cview.imageryLayers.get(this.gisKeyAndIndex[gidx3].idx).show = true;
              if (this.cNodes.length == 1) {
                this.cview.flyTo(this.cview.imageryLayers.get(this.gisKeyAndIndex[gidx3].idx));
              }
            } else {
              //未创建，需要创建
              this.serveService.getMapServeParam(event.node.origin.url + "?f=pjson").subscribe(
                data => {
                  let rectangle = new Cesium.Rectangle.fromDegrees(data.fullExtent.xmin, data.fullExtent.ymin, data.fullExtent.xmax, data.fullExtent.ymax);
                  this.cesiumService.createArcGISLayer(leafN.origin.url, null).then((layer) => {
                    this.gisKeyAndIndex.push({ id: leafN.origin.key, idx: this.cview.imageryLayers.length });
                    this.cview.imageryLayers.add(layer);
                    if (this.cNodes.length == 1) {
                      this.cview.flyTo(layer);
                    }
                  })
                }
              );
            }
          }
        });
        // console.log(this.cview.scene.primitives);
      } else {
        //关掉
        this.cNodes.forEach(leafN => {
          if (leafN.origin.type === "3dtitles") {
            const index4 = this.tilesKeyAndIndex.findIndex(tile => tile.id === leafN.origin.key);
            this.cview.scene.primitives.get(this.tilesKeyAndIndex[index4].idx).show = false;
          } else if (leafN.origin.type === "gis") {
            const gidx4 = this.gisKeyAndIndex.findIndex(tile => tile.id === leafN.origin.key);
            this.cview.imageryLayers.get(this.gisKeyAndIndex[gidx4].idx).show = false;
          }
        })
      }
    }
  }

  //递归遍历指定节点的所有叶子节点
  getLeafNode(node: any) {
    let childNodes = node.getChildren();
    childNodes.forEach(n => {
      if (n.isLeaf) {
        this.cNodes.push(n);
      } else {
        this.getLeafNode(n);
      }
    });
  }

  //创建树
  createTree(list, arr, parentId): any {
    list.forEach(item => {
      if (item.PId === parentId) {
        let child: any = {
          key: item.Id,
          url: item.Url,
          title: item.Title,
          type: item.Type,
          children: []
        }
        this.createTree(list, child.children, item.Id)
        // 这一句用来判断是否是叶子节点，并未叶子节点加上标记
        if (child.children.length == 0) {
          child.isLeaf = true;
        }
        arr.push(child)
      }
    })
  }

  activeNode(data: NzFormatEmitEvent): void {
    this.activatedNode = data.node!;
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  //右键缩放至图层
  zoomTo(): void {
    //判断所选图层是否已被勾选
    // console.log(this.activatedNode);
    if (this.activatedNode.origin.checked) {
      if (this.activatedNode.origin.type === "3dtitles") {
        if (this.tilesKeyAndIndex.findIndex(tile => tile.id === this.activatedNode.origin.key) != -1) {
          const index5 = this.tilesKeyAndIndex.findIndex(tile => tile.id === this.activatedNode.origin.key);
          this.cview.flyTo(this.cview.scene.primitives.get(this.tilesKeyAndIndex[index5].idx));
        } else {
          //其他错误
          this.message.error('其他错误！');
        }
      } else if (this.activatedNode.origin.type === "gis") {
        if (this.gisKeyAndIndex.findIndex(tile => tile.id === this.activatedNode.origin.key) != -1) {
          const gidx5 = this.gisKeyAndIndex.findIndex(tile => tile.id === this.activatedNode.origin.key);
          this.cview.flyTo(this.cview.imageryLayers.get(this.gisKeyAndIndex[gidx5].idx));
        } else {
          //其他错误
          this.message.error('其他错误！');
        }
      }
    } else {
      this.message.error('请先勾选该图层！');
    }
  }

  //关闭窗口
  closeWindow(): void {
    this.windowStyle = this.windowStyle1;
    this.isColse = false;
    this.isFold = false;
    this.isExpand = false;
    this.isLayerShow.emit(false);
  }

  //折叠窗口
  foldWindow(): void {
    this.windowStyle = this.windowStyle1;
    this.isColse = false;
    this.isFold = false;
    this.isExpand = true;
  }

  //展开窗口
  expandWindow(): void {
    this.windowStyle = this.windowStyle2;
    this.isColse = true;
    this.isFold = true;
    this.isExpand = false;
  }

}
