import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServeService } from '../../../../service/apis/serve.service';
import { CServe } from '../../../../model/cserve';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-cmap-serve',
  templateUrl: './cmap-serve.component.html',
  styleUrls: ['./cmap-serve.component.css']
})
export class CmapServeComponent implements OnInit {
  selectedValue = 'Title';
  searchValue = '';
  optionList = [ 
    {label:'服务名称', value:'Title'}, 
    {label:'父节点', value:'PId'}, 
    // {label:'类型', value:'Type'}
  ];
  isLoading1 = false;
  isLoading2 = false;
  listOfData: CServe[];
  listOfDisplayData: CServe[];
  listOfColumn = [
    {
      title: '服务id',
      compare: (a: CServe, b: CServe) => a.Id - b.Id,
      priority: 1
    },
    {
      title: '服务名称',
    },
    // {
    //   title: '别名',
    // },
    {
      title: '父节点',
    },
    {
      title: 'Url地址',
    },
    {
      title: '操作'
    },
  ];
  editCache: { [key: string]: { edit: boolean; data: CServe } } = {};

  constructor(private serveService: ServeService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.getServes();
  }

  getServes(): void {
    this.serveService.getAllCServes()
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
    this.serveService.deleteCServe(id).subscribe(result => {
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
    this.serveService.updateCServe(this.editCache[id].data).subscribe(result => {
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
      Title: "",
      Url: "",
      PId: 0,
    }
    this.serveService.addCServe(serve as CServe).subscribe(result => {
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

  search(): void {
    this.listOfDisplayData = this.listOfData.filter((item: CServe) => item[this.selectedValue].indexOf(this.searchValue) !== -1);
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

}
