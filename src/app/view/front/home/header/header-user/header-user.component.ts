import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../../../helper/auth/auth.service';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {

  avatar = this.auth.userName;
  role = this.auth.userRole;

  constructor(private message: NzMessageService, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  loginOut(): void{
    this.message.success('已退出，请重新登录！');
    this.auth.logout();
    this.router.navigate(['login']);
  }

}
