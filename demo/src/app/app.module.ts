import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';

import { AppComponent } from "./app.component.js";

import {
  ApiClientModule, ApiClientConfig,
  AuthConfig, authUserConfigToken, // AuthModule,
  StorageModule, StorageConfig,
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

import { CustomAuthInterceptor } from './api-client-module/custom-auth.intercepter.js';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

const apiClientConfig: ApiClientConfig = {
  apiBaseUrl: 'https://jsonplaceholder.typicode.com'
};

const authConfig: AuthConfig = {
  authApiUrl: 'http://www.mocky.io/v2/5a4e469d120000b90e24d99f',
  autoRefreshToken: true,
  loginScreenUrl: 'https://google.com'
};

const storageConfig: StorageConfig = {
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

    ApiClientModule.forRoot(apiClientConfig),
    // AuthModule.forRoot(authConfig),
    StorageModule.forRoot(storageConfig),
    BusyModule.forRoot(),
    ModalModule.forRoot(),
    ModelHelperModule.forRoot(),
    PipeExtensionModule.forRoot(),
    PopupModule.forRoot()
  ],
  providers: [
    // try to not import AuthModule but provide with custom
    CustomAuthService,
    { provide: authUserConfigToken, useValue: authConfig },
    { provide: HTTP_INTERCEPTORS, useClass: CustomAuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
