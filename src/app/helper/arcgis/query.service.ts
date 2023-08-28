import { Injectable } from '@angular/core';
import { loadModules, loadScript } from "esri-loader";
import { BehaviorSubject } from 'rxjs';
import * as serverAddress from '../../config/serve.address';

@Injectable()
export class ArcgisQueryService {

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
    //属性查询
    generalQuery(url, condition): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/tasks/QueryTask', 'esri/tasks/support/Query'])
                .then(([QueryTask, Query]) => {
                    let qTask = new QueryTask({
                        url: url
                    });
                    let params = new Query({
                        returnGeometry: true,
                        outFields: ["*"]
                    });
                    params.where = condition;
                    qTask.execute(params)
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((error) => {
                            resolve("error");
                            reject(error);
                        });
                })
        })
    };

    //空间查询（单个图层）
    spatialQuery(url, condition, geometry): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/tasks/QueryTask', 'esri/tasks/support/Query'])
                .then(([QueryTask, Query]) => {
                    let qTask = new QueryTask({
                        url: url
                    });
                    let params = new Query({
                        returnGeometry: true,
                        outFields: ["*"],
                    });
                    params.where = condition;
                    //geometry类型点、线、面
                    if (geometry != '') {
                        params.geometry = geometry;
                    }
                    qTask.execute(params)
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((error) => {
                            resolve("error");
                            reject(error);
                        });
                })
        })
    };

    //空间查询（多个图层）
    spatialQuery1(url, geometry, view): Promise<any> {
        console.log(view.extent);
        return new Promise((resolve, reject) => {
            loadModules(['esri/tasks/IdentifyTask', 'esri/tasks/support/IdentifyParameters'])
                .then(([IdentifyTask, IdentifyParameters]) => {
                    let iTask = new IdentifyTask({
                        url: url.substring(0, url.lastIndexOf("\/") + 1)
                    });
                    console.log(url.substring(url.lastIndexOf("\/") + 1, url.length));
                    let params = new IdentifyParameters({
                        tolerance: 3,
                        returnGeometry: true,
                        //layerOption: IdentifyParameters.LAYER_OPTION_ALL,
                        geometry: geometry,
                        layerIds: [parseInt(url.substring(url.lastIndexOf("\/") + 1, url.length))],
                        mapExtent:view.extent
                    });
                    iTask.execute(params)
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((error) => {
                            console.log(error);
                            resolve("error");
                            reject(error);
                        });
                })
        })
    };
}