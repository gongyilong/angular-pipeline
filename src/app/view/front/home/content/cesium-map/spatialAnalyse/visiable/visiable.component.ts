import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CesiumService } from 'src/app/helper/cesium/cesium.service';
import { CommunicateService } from 'src/app/service/map/communicate/communicate.service';
declare var Cesium;

@Component({
  selector: 'app-visiable',
  templateUrl: './visiable.component.html',
  styleUrls: ['./visiable.component.css']
})
export class VisiableComponent implements OnInit {

  /********** 全局变量 **********/
  windowStyle;
  windowStyle1 = { 'display': 'none' };
  windowStyle2 = { 'display': 'block' };
  isColse = true;
  isFold = true;
  isExpand = false;
  @Input() cview: any;
  @Output() isVisiableShow = new EventEmitter<any>();

  /********** 方法 **********/
  constructor(
    private cesiumService: CesiumService,
    private communicateService: CommunicateService,
  ) { }

  ngOnInit(): void {
    this.communicateService.cviewerOb.subscribe((cviewer) => {
      this.cview = cviewer;
    });
  }

  //通视分析
  visiableAnalyse(): void {
    let handler = new Cesium.ScreenSpaceEventHandler(this.cview.canvas);
    this.cesiumService.VisibilityAnalysis(handler, this.cview);
  }

  //移除
  remove(): void {
    let entityList = this.cview.entities.values;
    console.log(entityList);
    this.cview.entities.removeAll();
  }

  //关闭窗口
  closeWindow(): void {
    this.windowStyle = this.windowStyle1;
    this.isColse = false;
    this.isFold = false;
    this.isExpand = false;
    this.isVisiableShow.emit(false);
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
