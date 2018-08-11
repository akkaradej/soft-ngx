import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component.js';

import {
  // Modules
  ApiClientModule,
  BusyModule,
  ModalModule,
  ModelHelperModule,
  PipeExtensionModule,
  PopupModule,
  StorageModule,

  // Config Interfaces
  ApiClientConfig,
  AuthServiceConfig,
  AuthInterceptorConfig,
  CustomAuthRequestKey,
  CustomAuthResponseKey,
  StorageConfig,

  // User Config Tokens
  userAuthServiceConfigToken,
  userAuthInterceptorConfigToken,
  userCustomAuthRequestKeyToken,
  userCustomAuthResponseKeyToken
} from 'soft-ngx';

import { BusyModuleComponent } from './busy-module/busy-module.component';
import { ModalModuleComponent } from './modal-module/modal-module.component';
import { ModelHelperModuleComponent } from './model-helper-module/model-helper-module.component';
import { PipeExtensionModuleComponent } from './pipe-extension-module/pipe-extension-module.component';
import { PopupModuleComponent } from './popup-module/popup-module.component';
import { ApiClientModuleComponent } from './api-client-module/api-client-module.component';
import { AuthService } from './api-client-module/auth.service';
import { AuthInterceptor } from './api-client-module/auth.intercepter.js';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

const apiClientConfig: ApiClientConfig = {
  apiBaseUrl: 'https://jsonplaceholder.typicode.com',
  pageHeaderResponseKeys: {
    pageCount: 'X-Paging-PageCount',
    totalCount: 'X-Paging-TotalRecordCount'
  }
};

const authServiceConfig: AuthServiceConfig = {
  tokenUrl: 'http://www.mocky.io/v2/5a4e469d120000b90e24d99f',
  isFormData: false,
  isJWT: false,
  isOAuth: true,
};

const authInterceptorConfig: AuthInterceptorConfig = {
  autoRefreshToken: true,
  loginScreenUrl: 'https://google.com'
};

const customAuthRequestKey: CustomAuthRequestKey = {
  username: 'username',
  password: 'password'
};

const customAuthResponseKey: CustomAuthResponseKey = {
  access_token: 'access_token',
  refresh_token: 'refresh_token'
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
    AuthService,
    { provide: userAuthServiceConfigToken, useValue: authServiceConfig },
    { provide: userAuthInterceptorConfigToken, useValue: authInterceptorConfig },
    { provide: userCustomAuthRequestKeyToken, useValue: customAuthRequestKey },
    { provide: userCustomAuthResponseKeyToken, useValue: customAuthResponseKey },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
