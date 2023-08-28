import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmapServeComponent } from './cmap-serve.component';

describe('CmapServeComponent', () => {
  let component: CmapServeComponent;
  let fixture: ComponentFixture<CmapServeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmapServeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmapServeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
