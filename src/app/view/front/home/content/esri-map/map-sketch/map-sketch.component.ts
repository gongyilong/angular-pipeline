import { Component, OnInit, Input } from '@angular/core';
import { CommunicateService } from 'src/app/service/map/communicate/communicate.service';
import { ArcgisBaseService } from 'src/app/helper/arcgis/base.service';

@Component({
  selector: 'app-map-sketch',
  templateUrl: './map-sketch.component.html',
  styleUrls: ['./map-sketch.component.css']
})
export class MapSketchComponent implements OnInit {

  /********** 全局对象 **********/
  @Input() view: any;
  @Input() map: any;
  sketchViewModel: any;
  symbols: any;
  tempGraphicsLayer: any;
  updateGraphic: any;
  flag = false;

  /********** 构造函数 **********/
  constructor(private communicateService: CommunicateService, private arcgisBaseService: ArcgisBaseService) { }

  ngOnInit(): void {
    this.communicateService.viewOb.subscribe((view) => {
      this.view = view;
    })
    this.communicateService.mapOb.subscribe((map) => {
      this.map = map;
    })
    this.communicateService.emitGraphic(this.tempGraphicsLayer);
  }

  /********** 方法 **********/
  //初始化是sketchViewModel
  initSketch(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.symbols = this.createSymbol();
      this.arcgisBaseService.createGraphicLayer('temp').then((tempGL) => {
        this.tempGraphicsLayer = tempGL;
        this.map.add(this.tempGraphicsLayer);
        this.flag = true;
        resolve(this.flag );
      })
    })
  }

  newSketch(type: any) {
    this.arcgisBaseService.createSketchViewModel(this.view, this.tempGraphicsLayer, this.symbols).then((sk) => {
      this.sketchViewModel = sk;
      this.sketchViewModel.on("draw-complete", this.addGraphic);
      this.tempGraphicsLayer.removeAll();
      this.sketchViewModel.create(type);
      this.communicateService.emitGraphic(this.tempGraphicsLayer);
    })
  }

  doSketch(type: any) {
    if(!this.flag){
      this.initSketch().then((flag)=>{
        this.newSketch(type);
      })
    }else{
      this.newSketch(type);
    }
  }

  //创建点、线、面Symbol样式
  createSymbol() {
    let pointSymbol = { // symbol used for points
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      style: "square",
      color: "#8A2BE2",
      size: "16px",
      outline: { // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 3 // points
      }
    }
    let polylineSymbol = { // symbol used for polylines
      type: "simple-line", // autocasts as new SimpleMarkerSymbol()
      color: "#8A2BE2",
      width: "4",
      style: "dash"
    }

    let polygonSymbol = { // symbol used for polygons
      type: "simple-fill", // autocasts as new SimpleMarkerSymbol()
      color: "rgba(138,43,226, 0.8)",
      style: "solid",
      outline: {
        color: "white",
        width: 1
      }
    }

    return [pointSymbol, polylineSymbol, polygonSymbol]
  }

  //添加graphic
  addGraphic(evt) {
    let geometry = evt.geometry;
    let symbol;
    // Choose a valid symbol based on return geometry
    switch (geometry.type) {
      case "point":
        symbol = this.symbols[0];
        break;
      case "polyline":
        symbol = this.symbols[1];
        break;
      default:
        symbol = this.symbols[2];
        break;
    }
    this.arcgisBaseService.createGraphic(geometry, symbol).then((gra) => {
      this.tempGraphicsLayer.add(gra);
    })
  }

  resetBtn() {
    this.tempGraphicsLayer.removeAll();
  }

}
