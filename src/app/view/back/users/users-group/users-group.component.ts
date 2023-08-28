import { Component, OnInit } from '@angular/core';
import { User } from '../../../../model/user';
import { UserService } from '../../../../service/apis/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-users-group',
  templateUrl: './users-group.component.html',
  styleUrls: ['./users-group.component.css']
})
export class UsersGroupComponent implements OnInit {

  selectedValue = 'UserName';

  optionList = [
    // {label:'Id', value:'Id'}, 
    {label:'用户名', value:'UserName'}, 
    {label:'所属部门', value:'Department'}, 
    {label:'角色', value:'Role'}, 
  ];

  searchValue = '';

  listOfColumn = [
    {
      title: 'Id',
      compare: (a: User, b: User) => a.Id - b.Id,
      priority: 1
    },
    {
      title: '用户名',
    },
    {
      title: '密码',
    },
    {
      title: '所属部门',
    },
    {
      title: '角色'
    },
    {
      title: '联系方式'
    },
    {
      title: '邮箱地址'
    },
    {
      title: '上次登录时间'
    },
    {
      title: '操作'
    },
  ];

  listOfData: User[];

  listOfDisplayData: User[];

  editCache: { [key: string]: { edit: boolean; data: User } } = {};

  constructor(private userService: UserService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  //获取所有用户
  getUsers(): void {
    this.userService.getAllUsers()
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
    // this.serveService.addServe()
    let ids = []
    this.listOfData.forEach(item => {
      ids.push(item.Id)
    });
    let user = {
      Id: Math.max(...ids) + 1,
      UserName: "",
      Password: "",
      Department: "",
      Role: "",
      Email: "",
      PhoneNum: "",
      LoginTime: null
    }
    this.userService.addUser(user as User).subscribe(result => {
      // console.log(result)
    });
    this.listOfDisplayData = [
      ...this.listOfDisplayData,
      user
    ];
    this.listOfData = [
      ...this.listOfData,
      user
    ];
    this.updateEditCache();
    this.startEdit(Math.max(...ids) + 1);
  }

  //删除记录
  deleteRow(id: number): void {
    //请求删除api接口，成功后删除表格对应行
    this.userService.deleteUser(id).subscribe(result => {
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
    this.userService.updateUser(this.editCache[id].data).subscribe(result => {
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
    this.listOfDisplayData = this.listOfData.filter((item: User) => item[this.selectedValue].indexOf(this.searchValue) !== -1);
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

}
