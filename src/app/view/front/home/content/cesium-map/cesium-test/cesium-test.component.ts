import { Component, OnInit } from '@angular/core';
declare var Cesium;

@Component({
  selector: 'app-cesium-test',
  templateUrl: './cesium-test.component.html',
  styleUrls: ['./cesium-test.component.css']
})
export class CesiumTestComponent implements OnInit {

  /********** 全局变量 **********/
  viewer: any;

  constructor() { }

  //初始化
  ngOnInit(): void {
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      infoBox: false,
      selectionIndicator: false,
      shadows: true,
      shouldAnimate: false,
    });
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
  }

}
