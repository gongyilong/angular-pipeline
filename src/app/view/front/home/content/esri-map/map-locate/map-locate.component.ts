import { Component, Input, OnInit } from '@angular/core';
import * as serverAddress from '../../../../../../config/serve.address';
import { ArcgisQueryService } from 'src/app/helper/arcgis/query.service';
import { ServeService } from 'src/app/service/apis/serve.service';

@Component({
  selector: 'app-map-locate',
  templateUrl: './map-locate.component.html',
  styleUrls: ['./map-locate.component.css']
})
export class MapLocateComponent implements OnInit {

  /********** 全局对象 **********/
  selectedValue = null;
  listOfOption = [];
  stree_url:any;
  @Input() view: any;

  /********** 方法 **********/
  constructor(private arcgisQueryService: ArcgisQueryService, private serveService: ServeService) { }

  nzFilterOption = () => true;

  ngOnInit(): void {
    this.getBaseServes();
  }

  search(value: string): void {
    let condition = 'NAME' + ' like \'%'+ value + '%\'';
    this.arcgisQueryService.generalQuery(this.stree_url + "/0", condition).then((res)=>{
      this.listOfOption = [];
      res.features.forEach(item => {
        this.listOfOption.push({
          value: item,
          text: item.attributes['NAME']
        })
      });
    })
  }

  query(){
    this.view.goTo(this.selectedValue);
  }

  getBaseServes() {
    this.serveService.getAllServes()
      .subscribe((result) => {
        result.data.forEach(item => {
          if (item.Type == '矢量底图') {
            this.stree_url = item.Address;
          }
        });
      });
  }

}
