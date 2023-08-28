import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommunicateService } from 'src/app/service/map/communicate/communicate.service';
declare var Cesium;

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.css']
})
export class MeasureComponent implements OnInit {

  /********** 全局变量 **********/
  windowStyle;
  windowStyle1 = { 'display': 'none' };
  windowStyle2 = { 'display': 'block' };
  isColse = true;
  isFold = true;
  isExpand = false;
  clampToGround = true;
  measure:any = null;
  @Input() cview: any;
  @Output() isMeasureShow = new EventEmitter<any>();

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
    this.isMeasureShow.emit(false);
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

  //地图量测
  mapMeasure(type): void {
    if(this.measure == null){
      this.measure = new Cesium.Measure(this.cview);
    }
    if (type) {
      switch (type) {
        // case '不贴地': this.clampToGround = false; break;
        case '空间距离': this.measure.drawLineMeasureGraphics({ clampToGround: this.clampToGround, callback: () => { } }); break;
        case '空间面积': this.measure.drawAreaMeasureGraphics({ clampToGround: this.clampToGround, callback: () => { } }); break;
        case '三角量测': this.measure.drawTrianglesMeasureGraphics({ callback: () => { } }); break;
        case '清除': this.measure._drawLayer.entities.removeAll(); break;
      }
    }
  }

}
