import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';

import { AppComponent } from "./app.component.js";

import {
  ApiClientModule, ApiClientConfig,
  BusyModule,
  ModalModule,
  ModelHelperModule,
  PipeExtensionModule,
  PopupModule
} from 'soft-ngx';
import { BusyModuleComponent } from './busy-module/busy-module.component';
import { ModalModuleComponent } from './modal-module/modal-module.component';
import { ModelHelperModuleComponent } from './model-helper-module/model-helper-module.component';
import { PipeExtensionModuleComponent } from './pipe-extension-module/pipe-extension-module.component';
import { PopupModuleComponent } from './popup-module/popup-module.component';
import { ApiClientModuleComponent } from './api-client-module/api-client-module.component';
import { CustomAuthService } from './api-client-module/custom-auth.service';

const apiClientConfig: ApiClientConfig = {
  apiBaseUrl: 'https://jsonplaceholder.typicode.com',
  authApiUrl: 'http://www.mocky.io/v2/5a4e469d120000b90e24d99f',
  authAdditionalData: ['is_admin', 'user_id', 'display_name'],
  loginScreenUrl: 'https://google.com',
  storagePrefix: 'demo-'
};

@NgModule({
  declarations: [
    AppComponent,
    ApiClientModuleComponent,
    BusyModuleComponent,
    ModalModuleComponent,
    ModelHelperModuleComponent,
    PipeExtensionModuleComponent,
    PopupModuleComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BsDatepickerModule.forRoot(),

    ApiClientModule.forRoot(apiClientConfig, CustomAuthService),
    BusyModule.forRoot(),
    ModalModule.forRoot(),
    ModelHelperModule.forRoot(),
    PipeExtensionModule.forRoot(),
    PopupModule.forRoot()
  ],
  providers: [
    CustomAuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
