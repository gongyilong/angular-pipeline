import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmapViewComponent } from './cmap-view.component';

describe('CmapViewComponent', () => {
  let component: CmapViewComponent;
  let fixture: ComponentFixture<CmapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmapViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
