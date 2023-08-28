import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../../../helper/auth/auth.service';


@Component({
  selector: 'app-header1',
  templateUrl: './header1.component.html',
  styleUrls: ['./header1.component.css']
})
export class Header1Component implements OnInit {

  /********** 变量 ***********/
  layerShow = false;
  visiableShow = false;
  viewshedShow = false;
  elevationShow = false;
  slopeShow = false;
  terrainOpcityShow = false;
  measureShow = false;

  /********** 方法 ***********/
  constructor(
    private message: NzMessageService, 
    private auth: AuthService, 
    private router: Router) {
  }

  ngOnInit(): void {

  }

  goBack(): void{
    this.router.navigate(['/back/cmaps'])
  }

  goTab(type): void {
    if(type === 'layer'){
      this.layerShow = true;
    }else if(type === 'visiable'){
      this.visiableShow = true;
    }else if(type === 'viewshed'){
      this.viewshedShow = true;
    }else if(type === 'elevation'){
      this.elevationShow = true;
    }else if(type === 'slope'){
      this.slopeShow = true;
    }else if(type === 'terrainOpcity'){
      this.terrainOpcityShow = true;
    }else if(type === 'measure'){
      this.measureShow = true;
    }
  }

  getLayerShow(e): void {
    this.layerShow = e;
  }

  getVisiableShow(e): void {
    this.visiableShow = e;
  }

  getViewshedShow(e): void {
    this.viewshedShow = e;
  }

  getElevationShow(e): void {
    this.elevationShow = e;
  }

  getSlopeShow(e): void {
    this.slopeShow = e;
  }

  getTerrainOpcityShow(e): void {
    this.slopeShow = e;
  }

  getMeasureShow(e): void {
    this.measureShow = e;
  }

  //跳转首页
  goHome(): void {
    this.router.navigate(['/home1/'])
  }

  //退出
  close(): void {
    this.message.success('已退出，请重新登录！');
    this.auth.logout();
    this.router.navigate(['login']);
  }

  //全屏
  fullScreen(): void {
    document.documentElement.requestFullscreen();
  }
}
