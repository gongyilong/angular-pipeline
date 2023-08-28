import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CesiumService } from 'src/app/helper/cesium/cesium.service';
import { CommunicateService } from 'src/app/service/map/communicate/communicate.service';
declare var Cesium;

@Component({
  selector: 'app-underground',
  templateUrl: './underground.component.html',
  styleUrls: ['./underground.component.css']
})
export class UndergroundComponent implements OnInit {

  /********** 全局变量 **********/
  windowStyle;
  windowStyle1 = { 'display': 'none' };
  windowStyle2 = { 'display': 'block' };
  isColse = true;
  isFold = true;
  isExpand = false;
  checked = false;
  fillOpcity = 0.8;
  @Input() cview: any;
  @Output() isTerrianOpcityShow = new EventEmitter<any>();


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

  //关闭窗口
  closeWindow(): void {
    this.windowStyle = this.windowStyle1;
    this.isColse = false;
    this.isFold = false;
    this.isExpand = false;
    this.isTerrianOpcityShow.emit(false);
    this.cview.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
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

  //是否开启地表透明
  showTerrainChange(e): void {
    let longitude = -3.82518;
    let latitude = 53.11728;
    let height = 72.8;

    let position = Cesium.Cartesian3.fromDegrees(
      longitude,
      latitude,
      height
    );

    let url = "http://localhost/static/SampleData/models/ParcLeadMine/ParcLeadMine.glb";

    this.cview.terrainProvider = new Cesium.createWorldTerrain({});

    if(this.checked){
      let entity = this.cview.entities.add({
        name: url,
        position: position,
        model: {
          uri: url,
        },
      });
      this.cview.flyTo(entity);
      
      this.cview.scene.screenSpaceCameraController.enableCollisionDetection = false;
    }
  }

  //透明度
  fillOpcityChange(e): void {
    this.cview.scene.globe.translucency.frontFaceAlpha  = this.fillOpcity;
    this.cview.scene.globe.translucency.enabled = true;
  }

}
