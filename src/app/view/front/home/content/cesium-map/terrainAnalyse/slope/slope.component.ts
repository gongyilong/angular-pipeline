import { Component, Input, OnInit } from '@angular/core';
import { CesiumService } from 'src/app/helper/cesium/cesium.service';
import { CommunicateService } from 'src/app/service/map/communicate/communicate.service';
declare var Cesium;

@Component({
  selector: 'app-slope',
  templateUrl: './slope.component.html',
  styleUrls: ['./slope.component.css']
})
export class SlopeComponent implements OnInit {

  /********** 全局变量 **********/
  windowStyle;
  windowStyle1 = { 'display': 'none' };
  windowStyle2 = { 'display': 'block' };
  isColse = true;
  isFold = true;
  isExpand = false;
  selectedValue = '自定义颜色表';
  options = [
    {
      text: "自定义颜色表",
      value: 0
    },
    {
      text: "渐变纹理",
      value: 1
    }
  ];
  slopeRamp = [];
  isDIY = true;
  isGradual = false;
  slopeMaterial:any;
  fillOpcity = 0.8;
  @Input() color1: string;
  @Input() color2: string;
  @Input() color3: string;
  @Input() color4: string;
  @Input() color5: string;
  @Input() cview: any;
  showRamp = false;
  bandOptions = [
  {
    'name': 'band1',
    'style': { 'background': '-webkit-linear-gradient(left, #c7164e 0%, #c7164e 15%, #1d37bd  30%, #1eaf9c 45%, #1eaf9c 60%, #46ce1c 75%, #c3b019 90%, #c5512c 100%)' },
    'value': 'band1'
  },
  {
    'name': 'band2',
    'style': { 'background': '-webkit-linear-gradient(left, #1c6d0c 0%, #248296 50%, #0e1f8c 100%)' },
    'value': 'band2'
  },
  {
    'name': 'band3',
    'style': { 'background': '-webkit-linear-gradient(left, #d00303 0%, #c9de1d 15%, #3bde1d 30%, #18c3ac 45%, #1835c3 60%, #a918c3 75%, #b118c3 90%, #c3183f 100%)' },
    'value': 'band3'
  },
];


  /********** 方法 **********/
  constructor(
    private cesiumService: CesiumService,
    private communicateService: CommunicateService,
  ) { }

  ngOnInit(): void {
    this.color1 = '#cfa939';
    this.color2 = '#716543';
    this.color3 = '#7e237c';
    this.color4 = '#39cfb1';
    this.color5 = '#8fcf39';
    this.communicateService.cviewerOb.subscribe((cviewer) => {
      this.cview = cviewer;
    });
  }

  chooseType(e):void {
    if(e === "自定义颜色表"){
      this.isDIY = true;
      this.isGradual = false;
    }else if (e === "渐变纹理"){
      this.isDIY = false;
      this.isGradual = true;
    }
  }

  getBandValue(value): void{
    console.log(value);
  }
  
  //关闭窗口
  closeWindow(): void {
    this.windowStyle = this.windowStyle1;
    this.isColse = false;
    this.isFold = false;
    this.isExpand = false;
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

  //更新坡度材质
  updateSlopePlygonMaterial():void{
    let ramp: any = document.createElement("canvas");
    ramp.opcity = this.fillOpcity;
    this.slopeMaterial = Cesium.Material.fromType("SlopeRamp");
    this.slopeMaterial.uniforms.image = this.cesiumService.getColorRamp(ramp, "elevation", this.fillOpcity, this.slopeRamp);
  }

  create(): void {
    this.cview.terrainProvider = new Cesium.createWorldTerrain({
      requestVertexNormals: true, 
    });
    if(this.isDIY){
      
    }else if(this.isGradual){
      
    }
    
  }

  remove(): void {

  }
}
