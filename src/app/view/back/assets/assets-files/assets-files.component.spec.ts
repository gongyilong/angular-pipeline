import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsFilesComponent } from './assets-files.component';

describe('AssetsFilesComponent', () => {
  let component: AssetsFilesComponent;
  let fixture: ComponentFixture<AssetsFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
