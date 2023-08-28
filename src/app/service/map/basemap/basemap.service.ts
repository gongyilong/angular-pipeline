/**
 * 图层加载服务：
 * 包括MapImageLayer、TileLayer、FeatureLayer
 */
import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { loadModules } from "esri-loader";
import { ServeService } from '../../apis/serve.service';
import { ViewService } from 'src/app/service/map/view/view.service';

@Injectable({
  providedIn: 'root'
})

export class BasemapService {

  constructor(private serveService: ServeService, private viewService: ViewService) {

    this.getAllServes();

    const modules = [
      'esri/layers/MapImageLayer',
      'esri/layers/TileLayer',
      'esri/layers/FeatureLayer',
      'esri/tasks/IdentifyTask',
      'esri/tasks/support/IdentifyParameters',
      'esri/PopupTemplate',
      'esri/tasks/QueryTask',
      'esri/tasks/support/Query',
      'esri/Graphic',
      'esri/layers/GraphicsLayer',
    ]

    loadModules(modules).then(([p, q, r, s, t, u, v, w, x, y]) => {
      this.MapImageLayer = p;
      this.TileLayer = q;
      this.FeatureLayer = r;
      this.IdentifyTask = s;
      this.IdentifyParameters = t;
      this.PopupTemplate = u;
      this.QueryTask = v;
      this.Query = w;
      this.Graphic = x;
      this.GraphicsLayer = y;
    })
  }

  //图层相关的类
  MapImageLayer;
  TileLayer;
  FeatureLayer;
  IdentifyTask;
  IdentifyParameters;
  PopupTemplate;
  QueryTask;
  Query;
  Graphic;
  GraphicsLayer;

  //地图服务MapServe,有顺序，索引0最底层
  serveArr = [];

  getAllServes(){
    this.serveService.getAllServes()
      .subscribe(result => this.filterData(result.data));
  }

  /**
   * 数据过滤
   */
  filterData(data){
    this.serveArr = [];
    data.forEach(item => {
      if(item.Type != '矢量底图' && item.Type != '影像底图'){
        this.serveArr.push(item.Address.split('6080')[1]);
      }
    });
  }

  /**
   * 加载切片地图
   * @param url 切片地图服务地址
   */
  loadTileMap(map_url) {
    let tile_layer = new this.TileLayer({
      url: map_url,
    });
    return tile_layer
  }

  /**
   * 加载MapServer服务
   * @param map_url 服务地址
   */
  loadImgMap(map_url) {
    let img_map = new this.MapImageLayer({
      url: map_url
    });
    return img_map
  }

  /**
   * 加载FeatureServer服务
   * @param map_url 服务地址
   */
  loadFeatureMap(map_url) {
    let f_map = new this.FeatureLayer({
      url: map_url
    });
    return f_map
  }

  /**
   * 初始化图层列表
   * @returns 
   */
  initLayerList(){
    let mapserve = [];
      for (let i of this.serveArr) {
        let img_map = new this.MapImageLayer({
          url: i,
        });
        mapserve.push(
          img_map
        )
      }
    return mapserve
  }

  createTree1(arr) {
    let tree = [];
    let sublayers
    for (let obj of arr) {
      sublayers = this.fltSublayers1(obj["allSublayers"]);
      tree.push({
        "name": obj["title"],
        "url": obj["url"],
        "sublayers": [sublayers]
      })

    }
    return sublayers
  }

  //同步异步问题，慎重！
  fltSublayers1(arr) {
    let sublayers = []
    for (let obj of arr["items"]) {
      sublayers.push({
        "id": obj["id"],
        "url": obj["url"],
        "title": obj["title"],
        "visible": obj["visible"],
        // "parent":obj["parent"]["id"],
      })
    }
    // console.log(sublayers);
    return sublayers
  }


  createTree(arr) {
    let tree = [];
    for (let obj of arr) {
      let sublayers = this.fltSublayers(obj["allSublayers"]);
      tree.push({
        "name": obj["title"],
        "url": obj["url"],
        "sublayers": [sublayers]
      })

    }
    // console.log(tree);
  }

  //同步异步问题，慎重！
  fltSublayers(arr) {
    // console.log(arr);
    let sublayers = []
    for (let obj of arr["items"]) {
      sublayers.push({
        "id": obj["id"],
        "url": obj["url"],
        "title": obj["title"],
        "visible": obj["visible"]
      })
    }
    // console.log(sublayers);
    return sublayers
  }

  //属性识别
  idenTask1(evt, view, arr): Promise<any> {
    let idParams = new this.IdentifyParameters({
      tolerance: 3,
      width: view.width,
      height: view.height,
      mapExtent: view.extent,
      geometry: evt.mapPoint,
      returnGeometry: true
    });
    return new Promise((resolve, reject) => {
      for (var i = this.serveArr.length - 1; i > -1; i--) {
        this.idenTask2(idParams, this.serveArr[i], i).then((res) => {
          if (res[0].results.length != 0) {
            let lid = String(res[1]) + String(res[0].results[0].layerId)
            // console.log(arr[lid][lid].visible)
            if (arr[lid][lid].visible) {
              i = -1
              // console.log(res.results)
              resolve(res[0].results);
            }
          }
        })
      }
    })
  }

  idenTask2(idParams, url, index): Promise<any> {
    let idTask = new this.IdentifyTask({
      url: url
    });
    //返回结果，为下一步处理做准备
    return new Promise((resolve, reject) => {
      idTask.execute(idParams)
        .then((res) => {
          resolve([res, index]);
        })
        .catch((error) => {
          reject(error);
        });
    })
  };

  //IdentifyTask属性识别
  idenTask(evt, url, view) {

    // console.log(view);
    let idTask = new this.IdentifyTask({
      url: url
    });
    //获取URL
    //设置弹出框
    let idParams = new this.IdentifyParameters({
      tolerance: 3,
      width: view.width,
      height: view.height,
      mapExtent: view.extent,
      geometry: evt.mapPoint,
      returnGeometry: true
    });
    //返回结果，为下一步处理做准备
    idTask.execute(idParams)
      .then((res) => {
        // console.log(res)
        view.popup.open()
      })
      .catch((error) => {
        // console.log(error)
      });

  }

  //属性查询
  generalQuery(url, condition): Promise<any> {
    let qTask = new this.QueryTask({
      url: url
    });
    let params = new this.Query({
      returnGeometry: true,
      outFields: ["*"]
    });
    params.where = condition;
    return new Promise((resolve, reject) => {
      qTask.execute(params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          resolve("error");
          reject(error);
        });
    })
  };

  //空间查询
  spatialQuery(url, condition, geometry): Promise<any> {
    let qTask = new this.QueryTask({
      url: url
    });
    let params = new this.Query({
      returnGeometry: true,
      outFields: ["*"],
    });
    params.where = condition;
    //geometry类型点、线、面
    if (geometry != '') {
      params.geometry = geometry;
    }
    return new Promise((resolve, reject) => {
      qTask.execute(params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          resolve("error");
          reject(error);
        });
    })
  };

  //高亮
  addGraphic(featrue) {
    let geometry = featrue.geometry;
    // console.log(geometry)
    let symbol;

    // Choose a valid symbol based on return geometry
    switch (geometry.type) {
      case "point":
        symbol = { // symbol used for points
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          style: "circle",
          color: "rgba(0,255,255, 0.8)",
          size: "16px",
        };
        break;
      case "polyline":
        symbol = { // symbol used for polylines
          type: "simple-line", // autocasts as new SimpleMarkerSymbol()
          color: "#00FFFF",
          width: "3",
          style: "solid",
          outline: { // autocasts as new SimpleLineSymbol()
            color: "rgba(0,255,255, 0.8)",
            width: "4"
          }
        };
        break;
      default:
        symbol = { // symbol used for polygons
          type: "simple-fill", // autocasts as new SimpleMarkerSymbol()
          color: "rgba(138,43,226, 0.8)",
          style: "solid",
          outline: {
            color: "white",
            width: 1
          }
        };
        break;
    }
    let graphic = new this.Graphic({
      geometry: geometry,
      symbol: symbol
    });
    return graphic
    // this.highlightLayer.add(graphic);
  }


}
