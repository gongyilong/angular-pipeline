import { Injectable } from '@angular/core';
import { loadModules, loadScript } from "esri-loader";
import { BehaviorSubject } from 'rxjs';
import * as serverAddress from '../../config/serve.address';

@Injectable()
export class ArcgisBaseService {

    /**********  全局变量  ***********/
    //使用这个意思是，加载了'esri-loader'，就不要每次再去加载了
    loaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**********  构造函数  ***********/
    constructor() {

        this.loaded$.subscribe(loaded => {
            if (!loaded) {
                loadScript({
                    // url: 'https://js.arcgis.com/4.10/'
                    url: serverAddress.arcgis_url + '/arcgis_js_api/library/4.16/dojo/dojo.js'
                    // url: serverAddress.arcgis_url + '/arcgis_js_api_out/library/4.16/dojo/dojo.js'
                }).then(() => {
                    this.loaded$.next(true);
                }).catch(err => this.loaded$.next(true));
            }
        });
    }

    /**********  方法  ***********/
    //创建地图对象
    createMap(layer: any): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/Map'])
                .then(([Map]) => {
                    const map = new Map({
                        basemap: {
                            baseLayers: [layer],
                            title: "矢量图",
                            thumbnailUrl: '../../../assets/map/vec.png'
                        },
                    });
                    resolve(map);
                })
        })
    }

    //创建地图容器对象
    createMapView(properties: any): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/views/MapView'])
                .then(([MapView]) => {
                    const view = new MapView(properties);
                    resolve(view);
                })
        })
    }

    //创建比例尺对象
    createScaleBar(view: any): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/widgets/ScaleBar'])
                .then(([ScaleBar]) => {
                    const scaleBar = new ScaleBar({
                        view: view,
                        style: 'ruler',
                        unit: 'metric'
                    });
                    resolve(scaleBar);
                })
        })
    }

    //创建地图中心点
    createCenter(x: any, y: any, sprf: any): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/geometry/Point'])
                .then(([Point]) => {
                    const pt = new Point({
                        x: x,
                        y: y,
                        spatialReference: sprf
                    });
                    resolve(pt);
                })
        })
    }

    //创建基础底图
    createBasemapToggle(view: any, url: any): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/Basemap', 'esri/widgets/BasemapToggle'])
                .then(([Basemap, BasemapToggle]) => {
                    this.loadImgMap(url).then((layer) => {
                        const zhyx = new Basemap({
                            baseLayers: [layer],
                            title: "影像图",
                            thumbnailUrl: '../../../assets/map/satellite.jpg'
                        });
                        const basemapToggle = new BasemapToggle({
                            titleVisible: true,
                            view: view,
                            nextBasemap: zhyx
                        });
                        resolve(basemapToggle);
                    })
                })
        })
    }

    //创建图层树
    createLayerTree(serves: any): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/layers/MapImageLayer'])
                .then(([MapImageLayer]) => {
                    const mapServes = []
                    for (let url of serves) {
                        mapServes.push(new MapImageLayer({
                            url: url
                        }));
                    }
                    resolve(mapServes)
                })
        })
    }

    //创建弹窗模板（PopupTemplate）
    createPopTep(fieldInfos: any): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/PopupTemplate'])
                .then(([PopupTemplate]) => {
                    let popTemp = new PopupTemplate({
                        title: "属性信息",
                        content: [{
                            type: "fields",
                            fieldInfos: fieldInfos
                        }],
                        actions: [{
                            title: "下载项目档案",
                            id: 'get-project',
                            image: '../../assets/others/download.png',
                        }]
                    })
                    resolve(popTemp)
                })
        })
    }

    //创建Highlight Graphic
    createHGL(featrue: any): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/Graphic'])
                .then(([Graphic]) => {
                    let symbol = {};
                    switch (featrue.geometry.type) {
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
                    const graphic = new Graphic({
                        geometry: featrue.geometry,
                        symbol: symbol
                    });
                    resolve(graphic)
                })
        })
    }

    //创建GraphicLayer
    createGraphicLayer(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/layers/GraphicsLayer'])
                .then(([GraphicsLayer]) => {
                    const graphicsLayer = new GraphicsLayer({
                        id: id
                    });
                    resolve(graphicsLayer)
                })
        })
    }

    //创建GraphicLayer
    createSketchViewModel(view: any, layer: any, symbols: any): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/widgets/Sketch/SketchViewModel'])
                .then(([SketchViewModel]) => {
                    const sketchViewModel = new SketchViewModel({
                        view: view,
                        layer: layer,
                        pointSymbol: symbols[0],
                        polylineSymbol: symbols[1],
                        polygonSymbol: symbols[2]
                    });
                    resolve(sketchViewModel)
                })
        })
    }

    //创建Graphic
    createGraphic(geometry: any, symbol: any): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/Graphic'])
                .then(([Graphic]) => {
                    const graphic = new Graphic({
                        geometry: geometry,
                        symbol: symbol
                    });
                    resolve(graphic)
                })
        })
    }

    //加载MapServer服务
    loadImgMap(mapUrl: any): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/layers/MapImageLayer'])
                .then(([MapImageLayer]) => {
                    const mapImgLayer = new MapImageLayer({
                        url: mapUrl
                    })
                    resolve(mapImgLayer)
                })
        })
    }

    //加载FeatureServer服务
    loadFeatureMap(mapUrl: any): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/layers/FeatureLayer'])
                .then(([FeatureLayer]) => {
                    const ftLayer = new FeatureLayer({
                        url: mapUrl
                    })
                    resolve(ftLayer);
                })
        })
    }

    //加载Tile切片地图
    loadTileMap(mapUrl: any): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/layers/TileLayer'])
                .then(([TileLayer]) => {
                    const titleLayer = TileLayer({
                        url: mapUrl
                    })
                    resolve(titleLayer);
                })
        })
    }

}