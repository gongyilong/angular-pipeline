import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerChooseComponent } from './layer-choose.component';

describe('LayerChooseComponent', () => {
  let component: LayerChooseComponent;
  let fixture: ComponentFixture<LayerChooseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerChooseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerChooseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
