import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from "./app.component.js";
import { AuthHelperService as MyAuthHelperService } from './app-custom-providers/auth-helper.service';

import {
  ApiClientModule, ApiClientConfig, AuthHelperService,
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

const apiClientConfig: ApiClientConfig = {
  apiBaseUrl: 'https://jsonplaceholder.typicode.com',
  authApiUrl: 'http://www.mocky.io/v2/5a45c66e2e0000ea2d70890f',
  loginScreenUrl: 'https://google.com',
  storagePrefix: 'demo-'
};

@NgModule({
  declarations: [
    AppComponent,
    BusyModuleComponent,
    ModalModuleComponent,
    ModelHelperModuleComponent,
    PipeExtensionModuleComponent,
    PopupModuleComponent,
    ApiClientModuleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BsDatepickerModule.forRoot(),

    ApiClientModule.forRoot(apiClientConfig),
    BusyModule.forRoot(),
    ModalModule.forRoot(),
    ModelHelperModule.forRoot(),
    PipeExtensionModule.forRoot(),
    PopupModule.forRoot()
  ],
  providers: [
    { provide: AuthHelperService, useClass: MyAuthHelperService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
