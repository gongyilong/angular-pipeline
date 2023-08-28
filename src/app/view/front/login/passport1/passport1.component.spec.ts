import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Passport1Component } from './passport1.component';

describe('Passport1Component', () => {
  let component: Passport1Component;
  let fixture: ComponentFixture<Passport1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Passport1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Passport1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
