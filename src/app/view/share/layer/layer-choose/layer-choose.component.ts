import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ArcgisQueryService } from 'src/app/helper/arcgis/query.service';

@Component({
  selector: 'app-layer-choose',
  templateUrl: './layer-choose.component.html',
  styleUrls: ['./layer-choose.component.css']
})
export class LayerChooseComponent implements OnInit {

  /********** 全局对象 **********/
  value: string[] = ['0-0-0'];
  @Input() nodes = [];
  @Output() optionListSend = new EventEmitter();
  @Output() queryValueSend = new EventEmitter();
  @Output() curentValueSend = new EventEmitter();
  @Output() urlSend = new EventEmitter();
  optionList = [];
  aliasList = [];
  url = '';
  opStatue = false;
  selectedValue = '';
  @Input() inputValue = '';
  queryValue: any;
  curentVal = '';
  @Input() statue: any;

  /********** 构造函数 **********/
  constructor(
    private message: NzMessageService, 
    private arcgisQueryService: ArcgisQueryService) { }

  ngOnInit(): void {
  }

  /********** 方法 **********/
  mouseAction(name: string, e: any): void {
    this.optionList = []
    if (e.node.origin.children.length != 0) {
      this.url = e.node.origin.url;
      this.urlSend.emit({"url": this.url, "isLeaft": false});
      this.selectedValue = '';
      this.curentVal  = '';
      this.queryValueSend.emit('');
      this.opStatue = true;
      this.message.info('包含多个图层，默认进行多图层空间范围查询！');
    } else {
      this.opStatue = false;
      this.message.success('选择了 ' + e.node.origin.title + " 图层");
      this.url = e.node.origin.url;
      this.urlSend.emit({"url": this.url, "isLeaft": true});
      this.arcgisQueryService.generalQuery(e.node.origin.url, "OBJECTID > 0").then((res) => {
        console.log(res);
        res.fields.forEach((value, index) => {
          this.optionList.push({'alias': value.alias, 'name': value.name, 'type':value.type});
        });
        console.log(this.optionList);
        this.optionListSend.emit(this.optionList);
      })
    }
  }

  selectedField(value: any): void {
    this.selectedValue = value;
    this.message.success("您选择了 " + value + " 字段");
    const index = this.optionList.findIndex(item => item.name === this.selectedValue);
    console.log(this.optionList[index].type);

    if(this.optionList[index].type == "string"){
      this.queryValue = this.selectedValue + ' = ' + "'" + this.curentVal + "'";
    }else{
      this.queryValue = this.selectedValue + ' = '  + this.curentVal;
    }
    // this.queryValue = this.selectedValue + ' = ' + "'" + this.curentVal + "'";
    this.queryValueSend.emit(this.queryValue);
    this.curentValueSend.emit(this.curentVal);
  }

  inputFieldVal(value: any): void {
    this.curentVal = value;
    const index = this.optionList.findIndex(item => item.name === this.selectedValue);
    if(this.optionList[index].type == "string"){
      this.queryValue = this.selectedValue + ' = ' + "'" + this.curentVal + "'";
    }else{
      this.queryValue = this.selectedValue + ' = '  + this.curentVal;
    }
    // this.queryValue = this.selectedValue + ' = ' + value;
    this.queryValueSend.emit(this.queryValue);
    this.curentValueSend.emit(this.curentVal);
  }
}
