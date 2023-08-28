import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommunicateService } from 'src/app/service/map/communicate/communicate.service';
declare var Cesium;

@Component({
  selector: 'app-viewshed',
  templateUrl: './viewshed.component.html',
  styleUrls: ['./viewshed.component.css']
})
export class ViewshedComponent implements OnInit {

  /********** 全局变量 **********/
  windowStyle;
  windowStyle1 = { 'display': 'none' };
  windowStyle2 = { 'display': 'block' };
  isColse = true;
  isFold = true;
  isExpand = false;
  arrViewField = [];
  @Input() cview: any;
  @Output() isViewshedShow = new EventEmitter<any>();
  horizonAngle = 120;
  veticleAngle = 60;
  visionHeight = 1.2;
  

  /********** 方法 **********/
  constructor(
    private communicateService: CommunicateService,
  ) { }

  ngOnInit(): void {
    this.communicateService.cviewerOb.subscribe((cviewer) => {
      this.cview = cviewer;
    });
  }

  //关闭窗口
  closeWindow(): void {
    this.windowStyle = this.windowStyle1;
    this.isColse = false;
    this.isFold = false;
    this.isExpand = false;
    this.isViewshedShow.emit(false);
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

  addViewshed(): void {
    // 分析参数
    let viewModel = { verticalAngle: 90, horizontalAngle: this.horizonAngle, distance: 10 };
    // 添加可视域
    let viewshed = new Cesium.ViewShed3D(this.cview, {
      horizontalAngle: Number(viewModel.horizontalAngle),
      verticalAngle: Number(viewModel.verticalAngle),
      distance: Number(viewModel.distance),
      calback: () => {
        viewModel.distance = viewshed.distance
      }
    });

    this.arrViewField.push(viewshed)
  }

  // 删除可视域
  deleteViewshed(): void {
    for (var i = 0, j = this.arrViewField.length; i < j; i++) {
      this.arrViewField[i].destroy()
    }
    this.arrViewField = [];
  }

}
