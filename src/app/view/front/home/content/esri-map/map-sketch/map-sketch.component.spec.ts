import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSketchComponent } from './map-sketch.component';

describe('MapSketchComponent', () => {
  let component: MapSketchComponent;
  let fixture: ComponentFixture<MapSketchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSketchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
