import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLayerListComponent } from './map-layer-list.component';

describe('MapLayerListComponent', () => {
  let component: MapLayerListComponent;
  let fixture: ComponentFixture<MapLayerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapLayerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapLayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
