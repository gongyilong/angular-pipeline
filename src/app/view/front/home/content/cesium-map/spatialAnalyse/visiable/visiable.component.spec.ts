import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiableComponent } from './visiable.component';

describe('VisiableComponent', () => {
  let component: VisiableComponent;
  let fixture: ComponentFixture<VisiableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
