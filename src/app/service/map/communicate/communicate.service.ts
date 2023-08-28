import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicateService {

  /********** 全局变量 ***********/
  //图层树
  private treeSb = new BehaviorSubject(null);
  treeOb = this.treeSb.asObservable();
  //地图对象
  private mapSb = new BehaviorSubject(null);
  mapOb = this.mapSb.asObservable();
  //地图容器
  private viewSb = new BehaviorSubject(null);
  viewOb = this.viewSb.asObservable();
  //绘制graphic
  private graphicSb = new BehaviorSubject(null);
  graphicOb = this.graphicSb.asObservable();
  //图层对象
  private layerSb = new BehaviorSubject(null);
  layerOb = this.layerSb.asObservable();
  //图层组对象
  private layersSb = new BehaviorSubject(null);
  layersOb = this.layersSb.asObservable();
  //Cesium.Viewer对象
  private cviewerSb = new BehaviorSubject(null);
  cviewerOb = this.cviewerSb.asObservable();



  /********** 构造方法 ***********/
  constructor() { }

  /********** 方法 ***********/
  emitTree(tree) {
    this.treeSb.next(tree);
  }

  emitMap(map) {
    this.mapSb.next(map);
  }

  emitView(view) {
    this.viewSb.next(view);
  }

  emitGraphic(graphic) {
    this.graphicSb.next(graphic);
  }

  emitLayer(layer) {
    this.layerSb.next(layer);
  }

  emitLayers(layers) {
    this.layersSb.next(layers);
  }

  emitCviewer(cviewer) {
    this.cviewerSb.next(cviewer);
  }
}
