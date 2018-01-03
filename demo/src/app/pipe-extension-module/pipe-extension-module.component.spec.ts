import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeExtensionModuleComponent } from './pipe-extension-module.component';

describe('PipeExtensionModuleComponent', () => {
  let component: PipeExtensionModuleComponent;
  let fixture: ComponentFixture<PipeExtensionModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipeExtensionModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipeExtensionModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
