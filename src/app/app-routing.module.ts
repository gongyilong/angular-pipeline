import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helper/auth/auth.guard';
import { HomeComponent } from './view/front/home/home/home.component';
import { Home1Component } from './view/front/home/home1/home1.component';
import { LoginComponent } from './view/front/login/login/login.component';
import { Login3DComponent } from './view/front/login/login3-d/login3-d.component';
//front（前端界面）
// import { LocationComponent } from './common/business/location/location.component';
// import { DataQueryComponent } from './common/business/data-query/data-query.component';
// import { AuxiVerifyComponent } from './common/business/auxi-verify/auxi-verify.component';
// import { AccAnalyseComponent } from './common/business/acc-analyse/acc-analyse.component';
// import { DataUpdateComponent } from './common/business/data-update/data-update.component';
import { DataQueryComponent } from './view/front/home/sidebar/data-query/data-query.component';
//back（后台界面）
import { BackComponent } from './view/back/back/back.component';
import { AssetsFilesComponent } from './view/back/assets/assets-files/assets-files.component';
import { PersonalInfoComponent } from './view/back/personal/personal-info/personal-info.component';
import { PersonalSettingComponent } from './view/back/personal/personal-setting/personal-setting.component';
import { UsersGroupComponent } from './view/back/users/users-group/users-group.component';
import { UsersPermissionComponent } from './view/back/users/users-permission/users-permission.component';
import { MapsServeComponent } from './view/back/maps/maps-serve/maps-serve.component';
import { CmapServeComponent } from './view/back/maps/cmap-serve/cmap-serve.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // { path: 'login', component: Login3DComponent },
  {
    // path: 'home', component: HomeComponent, canActivate: [AuthGuard],
    path: 'home', component: HomeComponent,
    // path: 'home1', component: Home1Component,
    children: [
      // {
      //   path: 'location',
      //   component: LocationComponent,
      // },
      {
        path: 'dataQuery',
        component: DataQueryComponent,
      },
      // {
      //   path: 'auxiVerify',
      //   component: AuxiVerifyComponent,
      // },
      // {
      //   path: 'accAnalyse',
      //   component: AccAnalyseComponent,
      // },
      // {
      //   path: 'dataUpdate',
      //   component: DataUpdateComponent,
      // },
    ],
  },
  {
    path: 'back', component: BackComponent,
    children: [
      {
        path: 'maps',
        component: MapsServeComponent,
      },
      {
        path: 'cmaps',
        component: CmapServeComponent,
      },
      {
        path: 'users',
        component: UsersGroupComponent,
      },
      {
        path: 'permission',
        component: UsersPermissionComponent,
      },
      {
        path: 'assets',
        component: AssetsFilesComponent,
      },
      {
        path: 'info',
        component: PersonalInfoComponent,
      },
      {
        path: 'setting',
        component: PersonalSettingComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
