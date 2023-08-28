import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../helper/auth/auth.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BasemapService } from 'src/app/service/map/basemap/basemap.service';

@Component({
  selector: 'app-back-user',
  templateUrl: './back-user.component.html',
  styleUrls: ['./back-user.component.css']
})
export class BackUserComponent implements OnInit {

  avatar = this.auth.userName;

  constructor(private message: NzMessageService, private auth: AuthService, private router: Router,private basemapService:BasemapService) { }

  ngOnInit(): void {
  }

  //系统登出
  loginOut(): void{
    this.message.success('已退出，请重新登录！');
    this.auth.logout();
    this.router.navigate(['login']);
  }

  //返回主页
  goHome(): void {
    this.basemapService.getAllServes();
    setTimeout(()=> {
      this.router.navigate(['home']);
      //内容0.5秒后执行
   }, 500);
  }

}
