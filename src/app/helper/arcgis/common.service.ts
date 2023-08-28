import { Injectable } from '@angular/core';
import { loadModules } from "esri-loader";

@Injectable()
export class ArcgisCommonService {

    /**********  全局变量  ***********/
    private Zoom: any;

    /**********  构造函数  ***********/
    constructor() {
        //API相关模块
        const modules = [
            'esri/widgets/Zoom',
        ];

        loadModules(modules).then(([p]) => {
            this.Zoom = p;
        })
    }

    /**********  方法  ***********/
    //属性查询
    mapZoom(operate, view) {
        let zoom = new this.Zoom({
            view: view
        });
        operate === "in" ? zoom.zoomIn() : zoom.zoomOut();
    }
}