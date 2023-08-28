import { Component, OnInit } from '@angular/core';
import { Project } from '../../../../model/project';
import { ProjectService } from '../../../../service/apis/project.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-assets-files',
  templateUrl: './assets-files.component.html',
  styleUrls: ['./assets-files.component.css']
})
export class AssetsFilesComponent implements OnInit {

  selectedValue = 'PrjName';
  optionList = [
    // {label:'Id', value:'Id'}, 
    {label:'任务号', value:'PrjName'}, 
    {label:'项目编号', value:'PrjNo'}, 
    {label:'许可证号', value:'LicCode'}, 
    {label:'年份', value:'Year'}, 
  ];
  searchValue = '';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Project, b: Project) => a.Id - b.Id,
      priority: 1
    },
    {
      title: '项目名称',
    },
    {
      title: '项目编号',
    },
    {
      title: '许可证号',
    },
    {
      title: '年份'
    },
    {
      title: '下载链接'
    },
    {
      title: '操作'
    },
  ];
  listOfData: Project[];
  listOfDisplayData: Project[];
  editCache: { [key: string]: { edit: boolean; data: Project } } = {};
  
  constructor(private projectService: ProjectService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.getProjects();
  }

  //获取所有用户
  getProjects(): void {
    this.projectService.getAllProjects()
      .subscribe(result => {
        if (result.status == 0) {
          this.listOfData = result.data;
          this.listOfDisplayData = [...this.listOfData];
          this.updateEditCache();
        } else {
          this.listOfDisplayData = [];
          this.updateEditCache();
        }
      });
  }

  //增加记录
  addRow(): void {
    //请求增加api接口，成功后增加表格对应行
    let ids = []
    this.listOfData.forEach(item => {
      ids.push(item.Id)
    });
    let project = {
      Id: Math.max(...ids) + 1,
      PrjName: "",
      PrjNo: "",
      LicCode: "",
      Year: "",
      Link: ""
    }
    this.projectService.addProject(project as Project).subscribe(result => {
      // console.log(result)
    });
    this.listOfDisplayData = [
      ...this.listOfDisplayData,
      project
    ];
    this.listOfData = [
      ...this.listOfData,
      project
    ];
    this.updateEditCache();
    this.startEdit(Math.max(...ids) + 1);
  }

  //删除记录
  deleteRow(id: number): void {
    //请求删除api接口，成功后删除表格对应行
    this.projectService.deleteProject(id).subscribe(result => {
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
    this.projectService.updateProject(this.editCache[id].data).subscribe(result => {
      // console.log(result)
    });
    Object.assign(this.listOfDisplayData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
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
    // console.log(this.selectedValue);
    this.listOfDisplayData = this.listOfData.filter((item: Project) => item[this.selectedValue].indexOf(this.searchValue) !== -1);
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

}
