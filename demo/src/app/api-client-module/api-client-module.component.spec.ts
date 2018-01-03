import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiClientModuleComponent } from './api-client-module.component';

describe('ApiClientModuleComponent', () => {
  let component: ApiClientModuleComponent;
  let fixture: ComponentFixture<ApiClientModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiClientModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiClientModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
