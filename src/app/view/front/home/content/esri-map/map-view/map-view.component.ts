import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ArcgisBaseService } from 'src/app/helper/arcgis/base.service';
import { ServeService } from 'src/app/service/apis/serve.service';
import * as serverAddress from '../../../../../../config/serve.address';
import { CommunicateService } from 'src/app/service/map/communicate/communicate.service';


@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  /*********** 全局对象 **********/
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  map: any;
  view: any;
  serveArr = [];
  layers:any;
  img_baseMap_url:any;
  vec_baseMap_url:any;

  /********** 方法 **********/
  constructor(private arcgisBaseService: ArcgisBaseService, private serveService: ServeService,private communicateService: CommunicateService) { }

  ngOnInit() {
    this.getBaseServes();
    // this.initMap();
  }

  //初始化地图
  initMap(): void {
    this.arcgisBaseService.loadImgMap(this.vec_baseMap_url).then((layer) => {
      this.arcgisBaseService.createMap(layer).then((map) => {
        this.map = map;
        this.communicateService.emitMap(this.map);
        this.getAllServes();
        const mapViewProperties = {
          container: this.mapViewEl.nativeElement,
          center: this.arcgisBaseService.createCenter(377844.468, 987126.555, 2435),
          scale: 400000,
          map: this.map,
        };
        this.arcgisBaseService.createMapView(mapViewProperties).then((view) => {
          this.view = view;
          this.view.ui.remove("zoom");
          this.view.ui._removeComponents(["attribution"]);
          this.communicateService.emitView(this.view);
          this.arcgisBaseService.createScaleBar(this.view).then((scaleBar) => {
            this.view.ui.add(scaleBar, {
              position: "bottom-left"
            });
          })
          this.arcgisBaseService.createBasemapToggle(this.view, this.img_baseMap_url).then((basemapToggle) => {
            this.view.ui.add(basemapToggle, {
              position: "bottom-right"
            });
          })
        });
      })
    })
  }

  getBaseServes() {
    this.serveService.getAllServes()
      .subscribe((result) => {
        result.data.forEach(item => {
          if (item.Type == '矢量底图') {
            this.vec_baseMap_url = item.Address;
          }
          if (item.Type == '影像底图') {
            this.img_baseMap_url = item.Address;
          }
        });
        this.initMap();
      });
  }

  //获取所有地图服务并过滤掉底图
  getAllServes() {
    this.serveService.getAllServes()
      .subscribe((result) => {
        this.serveArr = [];
        result.data.forEach(item => {
          if (item.Type != '矢量底图' && item.Type != '影像底图') {
            // this.serveArr.push('/map' + item.Address.split('6080')[1]);
            this.serveArr.push(item.Address);
          }
        });
        this.arcgisBaseService.createLayerTree(this.serveArr).then((allLayer) => {
          this.layers = allLayer;
          this.communicateService.emitLayers(this.layers);
          this.map.addMany(allLayer);
        }) 
      });
  }


}
