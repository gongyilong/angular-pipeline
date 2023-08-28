import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ArcgisQueryService } from 'src/app/helper/arcgis/query.service';
import { ArcgisBaseService } from 'src/app/helper/arcgis/base.service';
import { CommunicateService } from 'src/app/service/map/communicate/communicate.service';
import { ProjectService } from 'src/app/service/apis/project.service';

@Component({
  selector: 'app-data-query',
  templateUrl: './data-query.component.html',
  styleUrls: ['./data-query.component.css']
})
export class DataQueryComponent implements OnInit {

  /********** 全局对象 **********/
  attributes = ["ID", "地类名称", "标识码", "权属单位", "面积", "周长"]
  @Input() nodes = [];
  @Input() map: any;
  @Input() view: any;
  value: string[] = ['0-0-0'];
  optionList = [];
  filedList = [];
  nameList = [];
  listOfData = [];
  aliasList = [];
  url = '';
  isLeaft: true;
  count = 0;
  selectedValue = '';
  inputValue = '';
  queryValue: any;
  curentValue: any;
  isVisibleMiddle = false;
  highlightLayer: any;
  graphicLayer: any;
  featrues = {};
  fieldInfos = [];
  sql = '';
  isVisibleMiddle1 = false;
  statue = false;
  getPrj: any;
  fields = [];
  flag = -1;


  /********** 构造函数 **********/
  constructor(
    private message: NzMessageService,
    private projectService: ProjectService,
    private arcgisQueryService: ArcgisQueryService,
    private arcgisBaseService: ArcgisBaseService,
    private communicateService: CommunicateService,) { }

  ngOnInit(): void {
    this.communicateService.treeOb.subscribe(tree => {
      this.nodes = tree;
    });
    this.communicateService.mapOb.subscribe(map => {
      this.map = map;
    });
    this.communicateService.viewOb.subscribe(view => {
      this.view = view;
    });
    this.communicateService.graphicOb.subscribe(graphic => {
      this.graphicLayer = graphic;
    });
  }

  /********** 方法 **********/
  getOptionList(e: any) {
    this.optionList = e;
    this.aliasList = [];
    this.nameList = [];
    console.log(this.optionList);
    this.optionList.forEach((value, index) => {
      this.aliasList.push(value.alias);
      this.nameList.push(value.name);
    });
  }

  getqueryValue(e: any) {
    this.queryValue = e;
  }

  getcurentValue(e: any) {
    this.curentValue = e;
  }

  getUrl(e: any) {
    this.url = e.url;
    this.isLeaft = e.isLeaft;
  }

  queryVal(value): void {
    this.inputValue = '';
  }

  doQuery() {
    //1.先创建个高亮图层
    if (this.highlightLayer == null) {
      this.arcgisBaseService.createGraphicLayer('hLayer').then((gLayer) => {
        this.highlightLayer = gLayer;
        this.map.add(this.highlightLayer)
      })
    }
    //2.创建gemerty
    let geometry = '';
    if (this.graphicLayer != undefined && this.graphicLayer.graphics.items.length != 0) {
      geometry = this.graphicLayer.graphics.items[0].geometry
    }
    this.filedList = [];
    //3.判断选择的图层是否到叶子节点
    console.log(this.isLeaft);
    if (this.isLeaft == undefined) {
      this.message.warning("请先选择图层！");
    } else if (this.isLeaft == true) {
      //叶子节点
      this.flag = 0;
      this.queryByLeafLayer(geometry);
    } else if (this.isLeaft == false) {
      //非叶子节点
      this.flag = 1;
      this.queryMultiLayer(geometry)
    } else {
      this.message.error("未知错误！");
    }
  }

  queryByLeafLayer(geometry) {
    this.featrues = {};
    let condition = '';
    if (this.curentValue == '' || this.curentValue == undefined || this.queryValue == null || this.queryValue == '') {
      condition = 'OBJECTID > 0';
    } else {
      condition = this.queryValue;
    }

    this.arcgisQueryService.spatialQuery(this.url, condition, geometry).then((res) => {
      console.log(res);
      this.listOfData = [];
      this.count = res.features.length;
      this.message.success('共有 ' + this.count + ' 条记录');
      if (this.count != 0) {
        this.filedList = this.aliasList.slice(0, 4)
        this.nameList = this.nameList.slice(0, 4)
        this.view.goTo({
          target: res.features[0].geometry,
          scale: 25000
        });
        res.features.forEach(value => {
          this.featrues[value.attributes.OBJECTID] = value;
          // this.map.remove(this.map.findLayerById('temp'));
          this.arcgisBaseService.createHGL(value).then((gra) => {
            this.highlightLayer.add(gra);
          })
          this.listOfData.push(value.attributes);
        });
      }
    })

  }

  queryMultiLayer(geometry) {
    this.optionList = [];
    this.aliasList = [];
    this.nameList = [];
    this.filedList = [];
    this.featrues = {};
    if(geometry == ""){
      this.message.error("请先绘制空间范围，再做查询！")
    }else{
      this.arcgisQueryService.spatialQuery1(this.url, geometry, this.view).then((res) => {
        console.log(res);
        this.listOfData = [];
        this.count = res.results.length;
        this.message.success('共有 ' + this.count + ' 条记录');
        if (this.count != 0) {
          console.log(res.results[0].feature.attributes)
          this.aliasList = Object.keys(res.results[0].feature.attributes);
          this.nameList = Object.keys(res.results[0].feature.attributes);
          Object.keys(res.results[0].feature.attributes).forEach((key,v)=>{
            this.optionList.push({alias:key, name: key})
          })
          // this.optionList = Object.keys(res.results[0].feature.attributes);
          this.filedList = this.aliasList.slice(0, 4);
          this.nameList = this.nameList.slice(0, 4);
          this.view.goTo({
            // target: res.results[0].feature.geometry,
            target: geometry,
            scale: 2500
          });
          res.results.forEach(value => {
            this.featrues[value.feature.attributes.OBJECTID] = value.feature;
            // this.map.remove(this.map.findLayerById('temp'));
            this.arcgisBaseService.createHGL(value.feature).then((gra) => {
              this.highlightLayer.add(gra);
            })
            this.listOfData.push(value.feature.attributes);
          });
        }
      })
    }

  }

  //清除高亮
  cleanHighlight() {
    this.listOfData = [];
    this.count = 0;
    this.filedList = [];
    if (this.highlightLayer != null) {
      this.highlightLayer.removeAll();
    }
    this.message.success("成功清空内容！")
  }

  //定位缩放
  locate(id) {
    let lable;
    if (this.getPrj) {
      this.getPrj.remove();
    }
    this.fieldInfos = [];
    this.fields = [];
    if(this.flag == 0){
      Object.keys(this.featrues[id].attributes).forEach(key => {
        const index = this.optionList.findIndex(item => item.name === key);
        this.fields.push(key);
        this.fieldInfos.push({
          fieldName: key,
          label: this.optionList[index].alias,
        })
      });
    } else if(this.flag == 1){
      Object.keys(this.featrues[id].attributes).forEach(key => {
        this.fields.push(key);
        this.fieldInfos.push({
          fieldName: key,
        })
      });
    }
    console.log(this.featrues[id]);
    this.view.goTo({
      target: this.featrues[id].geometry,
      scale: 500
    });
    this.arcgisBaseService.createPopTep(this.fieldInfos).then((pop) => {
      this.featrues[id].popupTemplate = pop;
      this.view.popup.open({
        // location: this.view.center,
        title: "属性信息",
        features: [this.featrues[id]],
      });
      //触发档案下载按钮事件
      this.getPrj = this.view.popup.on("trigger-action", (event) => {
        if (event.action.id === "get-project") {
          if (this.fields.indexOf("LicCode") != -1) {
            this.projectService.getProjectByName(this.featrues[id].attributes['LicCode'])
              .subscribe(result => {
                console.log(result);
                if (result.data.length != 0) {
                  window.open(result.data[0]['Link']);
                } else {
                  this.message.info("暂无可挂接项目档案！");
                }
                this.getPrj.remove();
              })
          } else if (this.fields.indexOf("规划许可证号") != -1) {
            this.projectService.getProjectByName(this.featrues[id].attributes['规划许可证号'])
              .subscribe(result => {
                console.log(result);
                if (result.data.length != 0) {
                  window.open(result.data[0]['Link']);
                } else {
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

}
