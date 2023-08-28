import { Component, OnInit } from '@angular/core';
import { User } from '../../../../model/user';
import { UserService } from '../../../../service/apis/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../../helper/auth/auth.service';

@Component({
  selector: 'app-personal-setting',
  templateUrl: './personal-setting.component.html',
  styleUrls: ['./personal-setting.component.css']
})
export class PersonalSettingComponent implements OnInit {

  constructor(private userService: UserService, private message: NzMessageService, private auth: AuthService) { }

  avatar = this.auth.userName;
  user = {
    Id: null,
    UserName: '',
    Password: '',
    Department: '',
    Role: '',
    Email: '',
    PhoneNum: '',
    LoginTime: '',
  };
  isLoading = false;

  ngOnInit(): void {
    this.getUserByName();
  }

  //获取所有用户
  getUserByName(): void {
    this.userService.getUserByName(this.avatar)
      .subscribe(result => {
        // console.log(result);
        if (result.status == 0) {
          // console.log(result);
          this.user = result.data[0];
          // console.log(this.user.Department);
        } else {
          // console.log(result);
        }
      });
  }

  //更新用户信息
  updateUser(): void {
    this.isLoading = true;
    this.userService.updateUser(this.user).subscribe(result => {
      this.isLoading = false;
      if(result.status == 1){
        this.isLoading = false;
        this.message.success("个人信息修改成功！");
        this.user = result.data[0];
      }else{
        this.message.error("个人信息修改失败！");
      }
    });
  }

}
