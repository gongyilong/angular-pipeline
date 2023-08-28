import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-advance-query',
  templateUrl: './advance-query.component.html',
  styleUrls: ['./advance-query.component.css']
})
export class AdvanceQueryComponent implements OnInit {

  /********** 全局对象 **********/
  isVisibleMiddle = false;
  sql = '';
  @Input() optionList;
  @Output() queryValueSend = new EventEmitter();
  queryValue: any;

  /********** 构造方法 **********/
  constructor(
    private message: NzMessageService, 
  ) { }

  ngOnInit(): void {
  }

  /********** 方法 **********/
  showModal() {
    this.isVisibleMiddle = true;
  }

  handleOkMiddle(): void {
    if (this.optionList.length == 0) {
      this.message.error('图层无属性字段或未选择图层！');
    } else {
      this.queryValue = this.sql;
      this.queryValueSend.emit(this.queryValue);
      this.isVisibleMiddle = false;
    }
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  getFiled(item) {
    this.sql += item + ' ';
  }

  getOperator(value) {
    this.sql += value + ' ';
  }
}
