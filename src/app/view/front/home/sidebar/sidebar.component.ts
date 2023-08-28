import { Component, Input, ElementRef, Output, EventEmitter, Inject, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  //全局变量
  @ViewChild('location') private location: ElementRef;
  @ViewChild('dataQuery') private dataQuery: ElementRef;
  @ViewChild('auxiVerify') private auxiVerify: ElementRef;
  @ViewChild('accAnalyse') private accAnalyse: ElementRef;
  @ViewChild('dataUpdate') private dataUpdate: ElementRef;
  //传值
  @Output() sideBarEvent = new EventEmitter();

  constructor() { }

  @Input() isCollapse = true;

  ngOnInit(): void {
  }

  locationShow() {
    this.isCollapse = false;
    this.styleRestore();
    this.location.nativeElement.style.background = "#0575E6";
    this.sideBarItem('location');
  }

  dataQueryShow() {
    this.isCollapse = false;
    this.styleRestore();
    this.dataQuery.nativeElement.style.background = "#0575E6";
    this.sideBarItem('dataQuery');
  }

  auxiVerifyShow() {
    this.isCollapse = false;
    this.styleRestore();
    this.auxiVerify.nativeElement.style.background = "#0575E6";
    this.sideBarItem('auxiVerify');
  }

  accAnalyseShow() {
    this.isCollapse = false;
    this.styleRestore();
    this.accAnalyse.nativeElement.style.background = "#0575E6";
    this.sideBarItem('accAnalyse');
  }

  dataUpdateShow() {
    this.isCollapse = false;
    this.styleRestore();
    this.dataUpdate.nativeElement.style.background = "#0575E6";
    this.sideBarItem('dataUpdate');
  }

  //样式还原
  styleRestore() {
    this.location.nativeElement.style.background = "#162F58";
    this.dataQuery.nativeElement.style.background = "#162F58";
    this.auxiVerify.nativeElement.style.background = "#162F58";
    this.accAnalyse.nativeElement.style.background = "#162F58";
    this.dataUpdate.nativeElement.style.background = "#162F58";
  }

  sideBarItem(tab) {
    this.sideBarEvent.emit(tab);
  }
}
