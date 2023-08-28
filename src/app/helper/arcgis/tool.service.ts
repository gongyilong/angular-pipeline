import { Injectable } from '@angular/core';
import { loadModules, loadScript } from "esri-loader";
import { BehaviorSubject } from 'rxjs';
import * as serverAddress from '../../config/serve.address';

@Injectable()
export class ArcgisToolService {

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
    //地图缩放
    createZoom(view: any) {
        return new Promise((resolve, reject) => {
            loadModules(['esri/widgets/Zoom'])
                .then(([Zoom]) => {
                    const zoom = new Zoom({
                        view: view
                    });
                    resolve(zoom);
                })
        })
    }

    //地图量测
    createMeasurement(view: any) {
        return new Promise((resolve, reject) => {
            loadModules(['esri/widgets/Measurement'])
                .then(([Measurement]) => {
                    const measure = new Measurement({
                        view: view
                    });
                    resolve(measure);
                })
        })
    }

    //属性识别
    idenTask(evt, view, url, index): Promise<any> {
        return new Promise((resolve, reject) => {
            loadModules(['esri/tasks/support/IdentifyParameters', 'esri/tasks/IdentifyTask'])
                .then(([IdentifyParameters, IdentifyTask]) => {
                    //构造参数
                    const params = new IdentifyParameters({
                        tolerance: 3,
                        width: view.width,
                        height: view.height,
                        mapExtent: view.extent,
                        geometry: evt.mapPoint,
                        returnGeometry: true
                    });
                    const idTask = new IdentifyTask({
                        url: url
                    });
                    idTask.execute(params)
                        .then((res) => {
                            resolve([res, index]);
                        })
                })
        })
    }


}