import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  // Configs
  SoftApiClientConfig, SoftAuthServiceConfig, SoftAuthInterceptorConfig,
  SoftPopupConfig, SoftStorageConfig, SoftAuthRequestKey, SoftAuthResponseKey,

  // Modules
  SoftNgxModule,

  // Interceptors
  DateRequestInterceptor, NoCacheInterceptor,

  // Config Tokens
  userSoftApiClientConfigToken, userSoftAuthServiceConfigToken, userSoftAuthInterceptorConfigToken,
  userSoftAuthRequestKeyToken, userSoftAuthResponseKeyToken, userSoftPopupConfigToken,
  userSoftStorageConfigToken,

} from 'soft-ngx';

import { AuthService } from './demo-api-client/auth.service';
import { DemoApiClientComponent } from './demo-api-client/demo-api-client.component';
import { DemoModalComponent } from './demo-modal/demo-modal.component';
import { DemoModelComponent } from './demo-model/demo-model.component';
import { DemoPipeComponent } from './demo-pipe/demo-pipe.component';
import { DemoPopupComponent } from './demo-popup/demo-popup.component';
import { DemoAsyncUIComponent } from './demo-async-ui/demo-async-ui.component';
import { FormsModule } from '@angular/forms';
import { CustomDialogComponent } from './demo-popup/custom-dialog-component';
import { DemoScrollComponent } from './demo-scroll/demo-scroll.component';

export function initApiClientConfig(): SoftApiClientConfig {
  return {
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    pageHeaderResponseKeys: {
      pageCount: 'X-Paging-PageCount',
      totalCount: 'X-Paging-TotalRecordCount',
    },
  };
}

export function initAuthServiceConfig(): SoftAuthServiceConfig {
  return {
    tokenUrl: 'http://www.mocky.io/v2/5a4e469d120000b90e24d99f',
    isOAuth: true,
    isFormData: false,
    isJWT: false,
  };
}

export function initAuthInterceptorConfigToken(): SoftAuthInterceptorConfig {
  return {
    autoRefreshToken: true,
    loginScreenUrl: 'https://google.com',
  };
}

export function initPopupConfig(): SoftPopupConfig {
  return {
    // general
    agreeText: 'Yes',
    disagreeText: 'No',
    // alert
    alertAgreeText: 'OK',
    // delete
    deleteTitleFunc: (itemName: string) => {
      return `Confirm Deletion`;
    },
    deleteMessageFunc: (itemName: string) => {
      return `Are you sure you want to delete "${itemName}"?`;
    },
  };
}

export function initStorageConfig(): SoftStorageConfig {
  return {
    storagePrefix: 'demo-',
  };
}

const customAuthRequestKey: SoftAuthRequestKey = {
  username: 'username',
  password: 'password',
};

const customAuthResponseKey: SoftAuthResponseKey = {
  access_token: 'access_token',
  refresh_token: 'refresh_token'
};

@NgModule({
  declarations: [
    AppComponent,

    // Demo Component
    DemoApiClientComponent,
    DemoAsyncUIComponent,
    DemoModalComponent,
    DemoModelComponent,
    DemoPipeComponent,
    DemoPopupComponent,
    DemoScrollComponent,
    CustomDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,

    // Single import at AppModule or CoreModule
    SoftNgxModule.forRoot(AuthService),

    //// Single import at SharedModule // => for lazy loading module
    // SoftNgxModule

    //// Selective import at AppModule or CoreModule
    // SoftApiClientModule.forRoot(),
    // SoftAuthModule.forRoot(AuthService),
    // SoftPopupModule.forRoot(),
    // SoftScrollModule.forRoot(),
    // SoftStorageModule.forRoot(),
    // SoftAsyncUIModule.forRoot(),
    // SoftModalModule, // => for non-lazy loading module only
    // SoftModelModule, // => for non-lazy loading module only
    // SoftPipeModule, // => for non-lazy loading module only
    // SoftTooltipModule, // => for non-lazy loading module only

    //// Selective import at SharedModule // => for lazy loading module
    // SoftAsyncUIModule,
    // SoftModalModule,
    // SoftModelModule,
    // SoftPipeModule,
    // SoftTooltipModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: DateRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NoCacheInterceptor, multi: true },
    { provide: userSoftApiClientConfigToken, useFactory: initApiClientConfig },
    { provide: userSoftAuthServiceConfigToken, useFactory: initAuthServiceConfig },
    { provide: userSoftAuthInterceptorConfigToken, useFactory: initAuthInterceptorConfigToken },
    { provide: userSoftAuthRequestKeyToken, useValue: customAuthRequestKey },
    { provide: userSoftAuthResponseKeyToken, useValue: customAuthResponseKey },
    { provide: userSoftPopupConfigToken, useFactory: initPopupConfig },
    { provide: userSoftStorageConfigToken, useFactory: initStorageConfig },
    AuthService,
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    CustomDialogComponent,
  ]
})
export class AppModule { }
