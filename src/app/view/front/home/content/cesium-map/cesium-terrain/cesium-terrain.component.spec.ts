import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CesiumTerrainComponent } from './cesium-terrain.component';

describe('CesiumTerrainComponent', () => {
  let component: CesiumTerrainComponent;
  let fixture: ComponentFixture<CesiumTerrainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CesiumTerrainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CesiumTerrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
