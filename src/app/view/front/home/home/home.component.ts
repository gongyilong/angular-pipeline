import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('side') side: SidebarComponent;
  isCollapse;
  panelWidth = 0;
  mapWidth = 24;
  collapseStatue;
  collapse0 = { 'display': 'none' };
  collapse1 = { 'position': 'absolute', 'top': (1 / 2) * document.body.offsetHeight - 94 + 'px', 'left': '0px', 'z-index': '10', 'display': 'block', 'cursor': 'pointer' };

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.collapseStatue = this.collapse0;
    this.isCollapse = true;
  }

  closePanel() {
    this.isCollapse = true;
    this.collapseStatue = this.collapse0;
    this.panelWidth = 0;
    this.mapWidth = 24;
    this.side.styleRestore();
  }

  sidebarCtr(e) {
    this.isCollapse = false;
    this.collapseStatue = this.collapse1;
    this.panelWidth = 5;
    this.mapWidth = 19;
    this.router.navigate(['/home/' + e]);
  }
}
