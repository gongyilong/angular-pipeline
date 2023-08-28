import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Login3DComponent } from './login3-d.component';

describe('Login3DComponent', () => {
  let component: Login3DComponent;
  let fixture: ComponentFixture<Login3DComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Login3DComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Login3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
