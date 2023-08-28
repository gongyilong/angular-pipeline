import { Component, OnInit } from '@angular/core';
import { User } from '../../../../model/user';
import { UserService } from '../../../../service/apis/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../../helper/auth/auth.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {

  constructor(private userService: UserService, private message: NzMessageService, private auth: AuthService) { }

  avatar = this.auth.userName;
  user = {
    Id: '',
    UserName: '',
    Password: '',
    Department: '',
    Role: '',
    Email: '',
    PhoneNum: '',
    LoginTime: '',
  };


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
}
