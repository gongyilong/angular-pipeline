import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ArcgisToolService } from 'src/app/helper/arcgis/tool.service';
import { ArcgisBaseService } from 'src/app/helper/arcgis/base.service';
import { CommunicateService } from 'src/app/service/map/communicate/communicate.service';
import { ProjectService } from 'src/app/service/apis/project.service';

@Component({
  selector: 'app-map-toolbar',
  templateUrl: './map-toolbar.component.html',
  styleUrls: ['./map-toolbar.component.css']
})
export class MapToolbarComponent implements OnInit {

  /********** 全局对象 **********/
  @Input() view: any;
  @Input() map: any;
  @Input() serveArr: any;
  measurement: any;
  zoom: any;
  distance = false;
  area = false;
  ismapClick = false;
  identifyClick = false;
  getPrj: any;
  mapClick: any;
  fieldInfos = [];
  fields = [];
  layerArr: any;
  hightlayer: any;

  /********** 方法 **********/
  constructor(
    private arcgisToolService: ArcgisToolService,
    private arcgisBaseService: ArcgisBaseService,
    private message: NzMessageService,
    private projectService: ProjectService,
    private communicateService: CommunicateService) {

  }

  ngOnInit(): void {
    this.communicateService.layerOb.subscribe(layers => {
      this.layerArr = layers;
    })
  }

  //放大缩小
  mapZoom(operate: any): void {
    if (this.zoom == null) {
      this.arcgisToolService.createZoom(this.view).then((zoom: any) => {
        this.zoom = zoom;
        operate === "in" ? this.zoom.zoomIn() : this.zoom.zoomOut();
      })
    } else {
      operate === "in" ? this.zoom.zoomIn() : this.zoom.zoomOut();
    }
  }

  //全图
  fullExtent(): void {
    this.arcgisBaseService.createCenter(377844.468, 987126.555, 2435).then((pt) => {
      this.view.goTo({
        target: pt,
        scale: 400000
      });
    })
  }

  //面积、长度测量
  measureMent(type: string): void {
    if (this.measurement == null) {
      this.arcgisToolService.createMeasurement(this.view).then((ms) => {
        this.measurement = ms;
        this.measure(type);
      });
    } else {
      this.measure(type);
    }
  }

  measure(type: string): void {
    switch (type) {
      case 'distance':
        if (this.area) {
          this.message.warning("请先关闭面积测量！");
        } else {
          this.area = false;
          if (this.distance == false) {
            this.distance = true;
            this.measurement.activeTool = "distance";
          } else {
            this.distance = false;
            this.measurement.clear();
          };
        }
        break;
      case 'area':
        if (this.distance) {
          this.message.warning("请先关闭长度测量！");
        } else {
          this.distance = false;
          if (this.area == false) {
            this.area = true;
            this.measurement.activeTool = "area";
          } else {
            this.area = false;
            this.measurement.clear();
          };
        }
        break;
      case 'clear':
        this.measurement.clear();
        break;
    }
  }

  //属性识别
  identify() {
    let m = 0
    this.ismapClick = true;
    this.identifyClick = !this.identifyClick;
    if (this.getPrj) {
      this.getPrj.remove();
    }
    if (this.ismapClick && this.identifyClick) {
      this.message.success('属性识别已启用');
      this.mapClick = this.view.on("click", (event) => {
        event.stopPropagation();
        console.log(this.serveArr);
        for (let i = this.serveArr.length - 1; i > -1; i--) {
          this.arcgisToolService.idenTask(event, this.view, this.serveArr[i], i).then((res) => {
            //判定是否地图上顶层且可见图层
            if (this.isTopVisLayer(res)) {
              // console.log(res);
              //构造弹窗
              m = m + 1;
              // console.log(m);
              this.createPopup(res[0].results, event, m);
            }
          })
        }
        
      });
    } else {
      this.message.success('属性识别已关闭');
    }
  }

  //判定是否地图上顶层且可见图层
  isTopVisLayer(res) {
    console.log(res);
    if (res[0].results.length != 0) {
      let lid = String(res[1]) + String(res[0].results[0].layerId);
      return this.layerArr[lid][lid].visible
      // if (this.layerArr[lid][lid].visible) {
      //   return true
      // } else {
      //   return false
      // }
    } else {
      return false
    }
  }

  //构造弹窗模板及按钮事件
  createPopup(res, e, t) {
      if (this.getPrj) {
        this.getPrj.remove();
      }
      console.log(res);
      this.fieldInfos = [];
      this.fields = [];
      Object.keys(res[0].feature.attributes).forEach(key => {
        this.fields.push(key);
        this.fieldInfos.push({
          fieldName: key,
        })
      });
      console.log(this.fieldInfos);
      this.arcgisBaseService.createPopTep(this.fieldInfos).then((pop) => {
        console.log(pop);
        res[0].feature.popupTemplate = pop;
        this.view.popup.open({
          location: e.mapPoint,  // location of the click on the view
          title: res[0].layerName,  // title displayed in the popup
          features: [res[0].feature],
        });
        //高亮
        this.highLight(res);
        //触发档案下载按钮事件
        console.log(this.view.popup.actions);
        this.getPrj = this.view.popup.on("trigger-action", (event) => {
          if (event.action.id === "get-project") {
            console.log(this.fields);
            if (this.fields.indexOf("LicCode") != -1) {
              this.projectService.getProjectByName(res[0].feature.attributes['LicCode'])
                .subscribe(result => {
                  console.log(result);
                  if(result.data.length != 0){
                    window.open(result.data[0]['Link']);
                  }else{
                    this.message.info("暂无可挂接项目档案！");
                  }
                  this.getPrj.remove();
                })
            } else if (this.fields.indexOf("规划许可证号") != -1) {
              this.projectService.getProjectByName(res[0].feature.attributes['规划许可证号'])
                .subscribe(result => {
                  console.log(result);
                  if(result.data.length != 0){
                    window.open(result.data[0]['Link']);
                  }else{
                    this.message.info("暂无可挂接项目档案！");
                  }
                  this.getPrj.remove();
                })
            } else {
              this.message.info("暂无可挂接项目档案！");
              this.getPrj.remove();
            }
          }
        });
      })

  }

  //高亮
  highLight(res) {
    this.arcgisBaseService.createHGL(res[0].feature).then((graphic) => {
      if (this.hightlayer == null) {
        this.arcgisBaseService.createGraphicLayer('highlight').then((graphicLayer) => {
          this.map.add(graphicLayer);
          this.hightlayer = graphicLayer;
          this.hightlayer.add(graphic);
        })
      } else {
        this.hightlayer.add(graphic);
      }
    })
  }

  //清除
  clear() {
    this.identifyClick = false;
    if (this.hightlayer != null) {
      this.hightlayer.removeAll();
    }
    if (this.measurement != null) {
      this.measurement.clear();
    }
    this.message.success("清除高亮并重置！")
  }

}
