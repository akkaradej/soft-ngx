import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelHelperModuleComponent } from './model-helper-module.component';

describe('ModelHelperModuleComponent', () => {
  let component: ModelHelperModuleComponent;
  let fixture: ComponentFixture<ModelHelperModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelHelperModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelHelperModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
