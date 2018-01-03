import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupModuleComponent } from './popup-module.component';

describe('PopupModuleComponent', () => {
  let component: PopupModuleComponent;
  let fixture: ComponentFixture<PopupModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
