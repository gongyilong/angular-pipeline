import { Component, OnInit } from '@angular/core';
import { CesiumService } from 'src/app/helper/cesium/cesium.service';
import { CommunicateService } from 'src/app/service/map/communicate/communicate.service';

@Component({
  selector: 'app-cmap-view',
  templateUrl: './cmap-view.component.html',
  styleUrls: ['./cmap-view.component.css']
})
export class CmapViewComponent implements OnInit {

  constructor(private cesiumService:CesiumService, private communicateService: CommunicateService) { }

  ngOnInit(): void {
    this.cesiumService.createViewer('cesiumContainer').then((viewer)=>{
      this.communicateService.emitCviewer(viewer);
    })
  }

}
