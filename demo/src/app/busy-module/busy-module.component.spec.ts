import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusyModuleComponent } from './busy-module.component';

describe('BusyModuleComponent', () => {
  let component: BusyModuleComponent;
  let fixture: ComponentFixture<BusyModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusyModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusyModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
