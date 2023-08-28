import { Component, Output, EventEmitter, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { ServeService } from 'src/app/service/apis/serve.service';
import { ArcgisBaseService } from 'src/app/helper/arcgis/base.service';
import { CommunicateService } from 'src/app/service/map/communicate/communicate.service';

@Component({
  selector: 'app-map-layer-list',
  templateUrl: './map-layer-list.component.html',
  styleUrls: ['./map-layer-list.component.css']
})
export class MapLayerListComponent implements OnInit {

  /********** 全局变量 **********/
  isCollapsed = false;
  myStyle: any;
  style1 = { 'display': 'none' };
  style2 = { 'display': 'block' };
  searchValue = '';
  layerList = [];
  layerArr = [];
  defaultCheckedKeys = ['-1'];
  defaultSelectedKeys = ['-1'];
  nodes = [];
  @Input() map: any;
  @Input() layers: any;
  @Output() keyEvent = new EventEmitter();


  /********** 方法 **********/
  constructor(private layerUpRef:ChangeDetectorRef, private arcgisBaseService: ArcgisBaseService, private serveService: ServeService, private communicateService: CommunicateService) { }

  ngOnInit(): void {
    this.myStyle = this.style1;
  }

  //控制图层树显隐
  exit() {
    this.getLayerInfo(this.layers);
    console.log(this.layerList);
    this.nodes = this.convert(this.layerList, '-1')
    this.isCollapsed = !this.isCollapsed;
    this.communicateService.emitLayer(this.layerArr);
    this.communicateService.emitTree(this.nodes);
    if (this.isCollapsed) {
      this.myStyle = this.style2;
    } else {
      this.myStyle = this.style1;
    }
  }

  //获取图层信息
  getLayerInfo(layers) {
    layers.forEach((value, index) => {
      this.layerList.push({
        title: value.title,
        url: value.url,
        layers: []
      });
      this.getSublayers(value, index);
    })
  }

  //遍历子图层
  getSublayers(layer, index) {
    if (layer.sublayers && layer.sublayers != null) {
      return layer.sublayers.some((sublayer) => {
        let lid
        if (!Number.isInteger(sublayer.parent.id)) {
          lid = String(-1)
        } else {
          lid = String(index) + String(sublayer.parent.id)
        }
        this.layerList[index].layers[String(index) + String(sublayer.id)] = {
          key: String(index) + String(sublayer.id),
          url: sublayer.url,
          title: sublayer.title,
          parentId: lid,
          checked: true,
        }
        this.layerArr[String(index) + String(sublayer.id)] = {
          [String(index) + String(sublayer.id)]: sublayer
        };
        this.getSublayers(sublayer, index)
      });
    } else {
      Object.assign(this.layerList[index].layers[String(index) + String(layer.id)], { isLeaf: true })
      return false;
    }
  }

  convert(data, parentId) {
    let convertData = [];
    let severs = []
    for (let i = 0; i < data.length; i++) {
      for (let j in data[i].layers) {
        severs.push(data[i].layers[j])
      }
    }
    severs.forEach((item, index) => {
      if (item.parentId == parentId) {
        convertData.push(item);
        this.convertChild(severs, item, item.key)
      }
    })

    return convertData
  }

  convertChild(arr, parentItem, parentId) {
    parentItem.children = parentItem.children ? parentItem.children : [];
    arr.forEach(item => {
      if (item.parentId == parentId) {
        parentItem.children.push(item);
        this.convertChild(arr, item, item.key)
      }
    });
    return parentItem.children
  }

  nzClick(event: NzFormatEmitEvent): void {
  }

  nzCheck(event: NzFormatEmitEvent): void {
    let id = event.node.key;
    this.layerArr[id][id].visible = !this.layerArr[id][id].visible;
  }

  nzEvent(event: NzFormatEmitEvent): void {
  }

  ngOnChanges(changesQuestion: SimpleChanges) {
    if (changesQuestion.layers !== undefined) {
      if (changesQuestion.layers.currentValue !== undefined) {
        setTimeout(()=>{
          this.exit();
      },1000)
      }
    }
  }

}
