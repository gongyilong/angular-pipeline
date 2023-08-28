import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceQueryComponent } from './advance-query.component';

describe('AdvanceQueryComponent', () => {
  let component: AdvanceQueryComponent;
  let fixture: ComponentFixture<AdvanceQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
