import { Component, OnInit, Input } from '@angular/core';
import { ArcgisBaseService } from 'src/app/helper/arcgis/base.service';
import { ServeService } from 'src/app/service/apis/serve.service';

@Component({
  selector: 'app-map-switch',
  templateUrl: './map-switch.component.html',
  styleUrls: ['./map-switch.component.css']
})
export class MapSwitchComponent implements OnInit {

  /********** 全局对象 **********/
  isShow = false;
  baseMaps = {};
  sate: any;
  vec: any;
  @Input() map: any


  /********** 方法 **********/
  constructor(private serveService: ServeService, private arcgisBaseService: ArcgisBaseService) { }

  ngOnInit(): void {
    this.getBaseMap();
  }

  //从后台获取基础底图url
  getBaseMap() {
    this.serveService.getServeByType('底图')
      .subscribe(result => {
        result.data.forEach(item => {
          this.baseMaps[item.Type] = item.Address;
        });
      })
  }

  //加载不同类型地图
  mapSwitch(type) {
    switch (type) {
      case '2D':
        if (this.vec == null) {
          this.arcgisBaseService.loadImgMap(this.baseMaps["矢量底图"]).then((vec)=>{
            this.vec = vec;
          });
        }
        this.map.basemap.baseLayers = [this.vec];
        break;
      case 'IMG':
        if (this.sate == null) {
          this.sate = this.arcgisBaseService.loadTileMap(this.baseMaps["影像底图"].split('6080')[1]);
        }
        this.map.basemap.baseLayers = [this.sate];
        break;
    }
  }

  //状态改变
  change() {
    this.isShow = !this.isShow;
  }

}
