import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './view/front/login/login/login.component';
import { PassportComponent } from './view/front/login/passport/passport.component';
import { ColorPickerModule } from 'ngx-color-picker';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './helper/auth/auth.service';
import { AuthGuard } from './helper/auth/auth.guard';
import { CesiumService } from './helper/cesium/cesium.service';
import * as serverAddress from './config/serve.address';
//helper/arcgis
import { ArcgisBaseService } from './helper/arcgis/base.service';
import { ArcgisQueryService } from './helper/arcgis/query.service';
import { ArcgisToolService } from './helper/arcgis/tool.service';
import { ArcgisCommonService } from './helper/arcgis/common.service';

//helper/cesium


//front
import { HomeComponent } from './view/front/home/home/home.component';
import { HeaderUserComponent } from './view/front/home/header/header-user/header-user.component';
import { HeaderComponent } from './view/front/home/header/header/header.component';
import { FooterComponent } from './view/front/home/footer/footer.component';
import { SidebarComponent } from './view/front/home/sidebar/sidebar.component';
//back
import { BackComponent } from './view/back/back/back.component';
import { UsersGroupComponent } from './view/back/users/users-group/users-group.component';
import { UsersPermissionComponent } from './view/back/users/users-permission/users-permission.component';
import { AssetsFilesComponent } from './view/back/assets/assets-files/assets-files.component';
import { PersonalInfoComponent } from './view/back/personal/personal-info/personal-info.component';
import { PersonalSettingComponent } from './view/back/personal/personal-setting/personal-setting.component';
import { MapsServeComponent } from './view/back/maps/maps-serve/maps-serve.component';
import { BackUserComponent } from './view/back/other/back-user/back-user.component';
import { MapViewComponent } from './view/front/home/content/esri-map/map-view/map-view.component';
import { MapLayerListComponent } from './view/front/home/content/esri-map/map-layer-list/map-layer-list.component';
import { MapSwitchComponent } from './view/front/home/content/esri-map/map-switch/map-switch.component';
import { MapToolbarComponent } from './view/front/home/content/esri-map/map-toolbar/map-toolbar.component';
import { MapLocateComponent } from './view/front/home/content/esri-map/map-locate/map-locate.component';
import { ContentComponent } from './view/front/home/content/content/content.component';
import { CmapViewComponent } from './view/front/home/content/cesium-map/cmap-view/cmap-view.component';
import { DataQueryComponent } from './view/front/home/sidebar/data-query/data-query.component';
import { MapSketchComponent } from './view/front/home/content/esri-map/map-sketch/map-sketch.component';
import { LayerChooseComponent } from './view/share/layer/layer-choose/layer-choose.component';
import { AdvanceQueryComponent } from './view/share/query/advance-query/advance-query.component';
import { CesiumTestComponent } from './view/front/home/content/cesium-map/cesium-test/cesium-test.component';
import { Login3DComponent } from './view/front/login/login3-d/login3-d.component';
import { Passport1Component } from './view/front/login/passport1/passport1.component';
import { Home1Component } from './view/front/home/home1/home1.component';
import { Header1Component } from './view/front/home/header/header1/header1.component';
import { CmapServeComponent } from './view/back/maps/cmap-serve/cmap-serve.component';
import { CesiumTerrainComponent } from './view/front/home/content/cesium-map/cesium-terrain/cesium-terrain.component';
import { ElevationComponent } from './view/front/home/content/cesium-map/terrainAnalyse/elevation/elevation.component';
import { SlopeComponent } from './view/front/home/content/cesium-map/terrainAnalyse/slope/slope.component';
import { LayerTreeComponent } from './view/front/home/content/cesium-map/layerCtr/layer-tree/layer-tree.component';
import { ViewshedComponent } from './view/front/home/content/cesium-map/spatialAnalyse/viewshed/viewshed.component';
import { VisiableComponent } from './view/front/home/content/cesium-map/spatialAnalyse/visiable/visiable.component';
import { UndergroundComponent } from './view/front/home/content/cesium-map/terrainAnalyse/underground/underground.component';
import { MeasureComponent } from './view/front/home/content/cesium-map/auxiliaryTools/measure/measure.component';

import { DelonACLModule } from '@delon/acl';
import { Query1Component } from './view/share/query1/query1.component';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  declarations: [
    AppComponent,
    PassportComponent,
    HomeComponent,
    LoginComponent,
    BackComponent,
    HeaderUserComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    UsersGroupComponent,
    UsersPermissionComponent,
    AssetsFilesComponent,
    PersonalInfoComponent,
    PersonalSettingComponent,
    MapsServeComponent,
    BackUserComponent,
    MapViewComponent,
    MapLayerListComponent,
    MapSwitchComponent,
    MapToolbarComponent,
    MapLocateComponent,
    ContentComponent,
    CmapViewComponent,
    DataQueryComponent,
    MapSketchComponent,
    LayerChooseComponent,
    AdvanceQueryComponent,
    CesiumTestComponent,
    Login3DComponent,
    Passport1Component,
    Home1Component,
    Header1Component,
    CmapServeComponent,
    CesiumTerrainComponent,
    ElevationComponent,
    SlopeComponent,
    LayerTreeComponent,
    ViewshedComponent,
    VisiableComponent,
    UndergroundComponent,
    MeasureComponent,
    Query1Component,
  ],
  imports: [
    DelonACLModule.forRoot(),
    BrowserModule,
    InfiniteScrollModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ColorPickerModule,
    NzIconModule.forRoot(icons),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // allowedDomains: [serverAddress.domain_url],
        // disallowedRoutes: [serverAddress.back_url + "/api/v1/login"],
        allowedDomains: [serverAddress.domain_url],
        disallowedRoutes: ["/back/api/v1/login"],
      }
    }),
  ],
  providers: [
    AuthService,
    AuthGuard,
    ArcgisBaseService,
    ArcgisQueryService,
    ArcgisToolService,
    ArcgisCommonService,
    CesiumService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
