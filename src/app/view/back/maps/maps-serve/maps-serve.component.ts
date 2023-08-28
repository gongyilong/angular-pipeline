import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServeService } from '../../../../service/apis/serve.service';
import { Serve } from '../../../../model/serve';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BasemapService } from '../../../../service/map/basemap/basemap.service';

@Component({
  selector: 'app-maps-serve',
  templateUrl: './maps-serve.component.html',
  styleUrls: ['./maps-serve.component.css']
})
export class MapsServeComponent implements OnInit {
  selectedValue = 'serveName';
  searchValue = '';
  optionList = [ 
    {label:'服务名称', value:'serveName'}, 
    {label:'别名', value:'Alias'}, 
    {label:'类型', value:'Type'}
  ];
  isLoading1 = false;
  isLoading2 = false;
  vecMap: any;
  imgMap: any;
  listOfData: Serve[];
  listOfDisplayData: Serve[];
  listOfColumn = [
    {
      title: '服务id',
      compare: (a: Serve, b: Serve) => a.Id - b.Id,
      priority: 1
    },
    {
      title: '服务名称',
    },
    {
      title: '别名',
    },
    {
      title: '类型',
    },
    {
      title: '地址',
    },
    {
      title: '操作'
    },
  ];
  editCache: { [key: string]: { edit: boolean; data: Serve } } = {};

  constructor(private serveService: ServeService, private message: NzMessageService, private basemapService: BasemapService) { }

  ngOnInit(): void {
    this.getServes();
  }

  getServes(): void {
    this.serveService.getAllServes()
      .subscribe(result => {
        if (result.status == 0) {
          this.listOfData = result.data;
          this.listOfDisplayData = [...this.listOfData];
          this.updateEditCache();
        } else {
          this.listOfData = [];
          this.listOfDisplayData = [];
          this.updateEditCache();
        }
      });
  }

  deleteRow(id: number): void {
    //请求删除api接口，成功后删除表格对应行
    this.serveService.deleteServe(id).subscribe(result => {
      // console.log(result)
    });
    this.listOfDisplayData = this.listOfDisplayData.filter(d => d.Id !== id);
    this.listOfData = this.listOfData.filter(d => d.Id !== id);
  }

  //开始编辑
  startEdit(id: number): void {
    this.editCache[id].edit = true;
  }

  //取消编辑
  cancelEdit(id: number): void {
    const index = this.listOfDisplayData.findIndex(item => item.Id === id);
    this.editCache[id] = {
      data: { ...this.listOfDisplayData[index] },
      edit: false
    };
  }

  //更新记录
  saveEdit(id: number): void {
    const index = this.listOfDisplayData.findIndex(item => item.Id === id);
    //请求更新api接口，成功后更新表格对应行
    this.serveService.updateServe(this.editCache[id].data).subscribe(result => {
      // console.log(result)
    });
    Object.assign(this.listOfDisplayData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  //增加记录
  addRow(): void {
    //请求增加api接口，成功后增加表格对应行
    let ids = []
    this.listOfData.forEach(item => {
      ids.push(item.Id)
    });
    let serve = {
      Id: Math.max(...ids) + 1,
      serveName: "",
      Alias: "",
      Type: "",
      Address: ""
    }
    this.serveService.addServe(serve as Serve).subscribe(result => {
      // console.log(result)
    });
    this.listOfDisplayData = [
      ...this.listOfDisplayData,
      serve
    ];
    this.listOfData = [
      ...this.listOfData,
      serve
    ];
    this.updateEditCache();
    this.startEdit(Math.max(...ids) + 1);
  }


  updateEditCache(): void {
    this.listOfDisplayData.forEach(item => {
      this.editCache[item.Id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  //设置矢量底图
  setBaseMap(name: string, address: string): void {
    if(address=='矢量底图'){
      this.isLoading1 = true;
    }
    if(address=='影像底图'){
      this.isLoading2 = true;
    }
    this.serveService.getServeByType(name)
      .subscribe(result => {
        let serve = result.data[0];
        serve.Address = address;
        this.serveService.updateServe(serve).subscribe(result => {
          if(result.status == 0){
            const index = this.listOfDisplayData.findIndex(item => item.Id === serve.Id);
            Object.assign(this.listOfDisplayData[index], serve);
            if(this.isLoading1 == true){
              this.isLoading1 = false;
            }
            if(this.isLoading2 == true){
              this.isLoading2 = false;
            }
            this.message.success('修改成功！');
          }
        });
    });
  }

  search(): void {
    console.log(this.searchValue);
    console.log(this.listOfData);
    this.listOfDisplayData = this.listOfData.filter((item: Serve) => item[this.selectedValue].indexOf(this.searchValue) !== -1);
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

}
