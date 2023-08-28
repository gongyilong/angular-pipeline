import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CesiumService } from 'src/app/helper/cesium/cesium.service';
import { CommunicateService } from 'src/app/service/map/communicate/communicate.service';
declare var Cesium;

@Component({
  selector: 'app-elevation',
  templateUrl: './elevation.component.html',
  styleUrls: ['./elevation.component.css']
})
export class ElevationComponent implements OnInit {

  /********** 全局变量 **********/
  isSpinning = false;
  windowStyle;
  windowStyle1 = { 'display': 'none' };
  windowStyle2 = { 'display': 'block' };
  isColse = true;
  isFold = true;
  isExpand = false;
  selectedValue = '等高线';
  isElevationLine = true;
  isElevationPlygon = false;
  isElevationMix = false;
  options = [
    {
      text: "等高线",
      value: 0
    },
    {
      text: "等高面",
      value: 1
    },
    // {
    //   text: "等高线面",
    //   value: 2
    // }
  ];
  //等高线基本属性设置
  lineSpace = 45;
  lineColor = ''
  lineWidth = 2.0;
  fillOpcity = 0.8;
  minHeight = 0;
  maxHeight = 200;
  @Input() color: string;
  @Output() sentColor = new EventEmitter();
  @Output() isElevationShow = new EventEmitter<any>();
  showRamp = false;
  bandOptions = [
    {
      'name': 'band1',
      'style': { 'background': '-webkit-linear-gradient(left, #c7164e 0%, #c7164e 15%, #1d37bd  30%, #1eaf9c 45%, #1eaf9c 60%, #46ce1c 75%, #c3b019 90%, #c5512c 100%)' },
      'value': '#c7164e 0,#c7164e 0.15,#1d37bd 0.3,#1eaf9c 0.45,#1eaf9c 0.6,#46ce1c 0.75,#c3b019 0.9,#c5512c 1'
    },
    {
      'name': 'band2',
      'style': { 'background': '-webkit-linear-gradient(left, #1c6d0c 0%, #248296 50%, #0e1f8c 100%)' },
      'value': '#1c6d0c 0,#248296 0.5,#0e1f8c 1'
    },
    {
      'name': 'band3',
      'style': { 'background': '-webkit-linear-gradient(left, #d00303 0%, #c9de1d 15%, #3bde1d 30%, #18c3ac 45%, #1835c3 60%, #a918c3 75%, #b118c3 90%, #c3183f 100%)' },
      'value': '#d00303 0,#c9de1d 0.15,#3bde1d 0.3,#18c3ac 0.45,#1835c3 0.6,#a918c3 0.75,#b118c3 0.9,#c3183f 1'
    },
  ];
  eleMaterial: any;
  elePlygonMaterial: any;
  shadingUniforms: any = {};
  contourUniforms: any = {};
  @Input() cview: any;
  rgb = [];
  eleRamp = ['#c7164e 0', '#c7164e 0.15', '#1d37bd 0.3', '#1eaf9c 0.45', '#1eaf9c 0.6', '#46ce1c 0.75', '#c3b019 0.9', '#c5512c 1'];
  checked = false;
  viewshed: any;
  arrViewField = [];

  /********** 方法 **********/
  constructor(
    private cesiumService: CesiumService,
    private communicateService: CommunicateService,) { }

  ngOnInit(): void {
    this.color = '#cfa939';
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
    this.isElevationShow.emit(false);
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

  colorChange(): void {
    this.showRamp = !this.showRamp;
  }

  getBandValue(value): void {
    this.eleRamp = [];
    this.eleRamp = value.split(",");
    console.log(this.eleRamp);
    this.updateElePlygonMaterial();
  }

  chooseType(e): void {
    if (e === "等高线") {
      this.isElevationLine = true;
      this.isElevationMix = false;
      this.isElevationPlygon = false;
    } else if (e === "等高面") {
      this.isElevationLine = false;
      this.isElevationMix = false;
      this.isElevationPlygon = true;
    }
    // else if (e === "等高线面"){
    //   this.isElevationLine = false;
    //   this.isElevationMix = true;
    //   this.isElevationPlygon = false;
    // }
  }

  ////等高线
  //线间距改变
  lineSpaceChange(e): void {
    this.updateEleMaterial();
  }

  //线宽改变
  lineWidthChange(e): void {
    this.updateEleMaterial();
  }

  //颜色改变
  colorPickerChange(): void {
    this.updateEleMaterial();
  }

  //最小高度改变
  minHeightChange(e): void {
    this.updateElePlygonMaterial();
  }

  //最大高度改变
  maxHeightChange(e): void {
    this.updateElePlygonMaterial();
  }

  //透明度改变
  fillOpcityChange(e): void {
    this.updateElePlygonMaterial();
  }

  showLineChange(e): void {
    this.updateElePlygonMaterial();
  }

  //动态更新等高线材质
  updateEleMaterial(): void {
    this.eleMaterial = Cesium.Material.fromType("ElevationContour");
    this.eleMaterial.uniforms.width = this.lineWidth;
    this.eleMaterial.uniforms.spacing = this.lineSpace;
    this.eleMaterial.uniforms.color = Cesium.Color.fromCssColorString(this.color);
    this.cview.scene.globe.material = this.eleMaterial;
  }

  //动态更新等高面材质
  updateElePlygonMaterial(): void {
    let ramp: any = document.createElement("canvas");
    ramp.opcity = this.fillOpcity;
    if (this.checked) {
      this.elePlygonMaterial = this.cesiumService.getElevationContourMaterial();
      this.elePlygonMaterial.materials.elevationRampMaterial.uniforms.minimumHeight = this.minHeight;
      this.elePlygonMaterial.materials.elevationRampMaterial.uniforms.maximumHeight = this.maxHeight;
      this.elePlygonMaterial.materials.contourMaterial.uniforms.width = this.lineWidth;
      this.elePlygonMaterial.materials.contourMaterial.uniforms.spacing = this.lineSpace;
      this.elePlygonMaterial.materials.contourMaterial.uniforms.color = Cesium.Color.fromCssColorString(this.color);
      this.elePlygonMaterial.materials.elevationRampMaterial.uniforms.image = this.cesiumService.getColorRamp(ramp, "elevation", this.fillOpcity, this.eleRamp);
    } else {
      this.elePlygonMaterial = Cesium.Material.fromType("ElevationRamp");
      this.elePlygonMaterial.uniforms.minimumHeight = this.minHeight;
      this.elePlygonMaterial.uniforms.maximumHeight = this.maxHeight;
      this.elePlygonMaterial.uniforms.image = this.cesiumService.getColorRamp(ramp, "elevation", this.fillOpcity, this.eleRamp);
    }
    this.cview.scene.globe.material = this.elePlygonMaterial;
  }

  start(): void {
    let ramp: any = document.createElement("canvas");
    ramp.opcity = this.fillOpcity;
    this.elePlygonMaterial = Cesium.Material.fromType("ElevationRamp");
    this.elePlygonMaterial.uniforms.minimumHeight = this.minHeight;
    this.elePlygonMaterial.uniforms.maximumHeight = this.maxHeight;
    this.elePlygonMaterial.uniforms.image = this.cesiumService.getColorRamp(ramp, "elevation", this.fillOpcity, this.eleRamp);
    console.log(this.elePlygonMaterial);
    let handler = new Cesium.ScreenSpaceEventHandler(this.cview.canvas);
    this.cesiumService.startDraw(handler, this.cview, "polygon", this.elePlygonMaterial);
  }

  clean(): void {
    this.cview.entities.removeAll();
  }

  create(): void {
    this.cview.terrainProvider = new Cesium.createWorldTerrain({
      requestVertexNormals: true, 
    });
    if(this.isElevationLine){
      this.updateEleMaterial();
    }else if(this.isElevationPlygon){
      this.updateElePlygonMaterial();
    }
    
  }

  remove(): void {
    this.cview.scene.globe.material = null;
  }

}
