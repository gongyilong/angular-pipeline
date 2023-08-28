import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsServeComponent } from './maps-serve.component';

describe('MapsServeComponent', () => {
  let component: MapsServeComponent;
  let fixture: ComponentFixture<MapsServeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapsServeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsServeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
