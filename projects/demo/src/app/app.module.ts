import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  // Configs
  SoftApiClientConfig, SoftAuthServiceConfig, SoftAuthInterceptorConfig,
  SoftPopupConfig, SoftStorageConfig, SoftAuthRequestKey, SoftAuthResponseKey,

  // Modules
  SoftApiClientModule, SoftAuthModule, SoftModalModule, SoftModelModule,
  SoftPopupModule, SoftStorageModule, SoftUIStateModule, SoftPipeModule,

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
import { DemoUIStateComponent } from './demo-ui-state/demo-ui-state.component';
import { FormsModule } from '@angular/forms';

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
    agreeText: 'ใช่',
    disagreeText: 'ไม่ใช่',
    // alert
    alertAgreeText: 'ตกลง',
    // delete
    deleteTitleFunc: (itemName: string) => {
      return `ยืนยันการลบ`;
    },
    deleteMessageFunc: (itemName: string) => {
      return `คุณต้องการลบ "${itemName}" ใช่หรือไม่`;
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
    DemoModalComponent,
    DemoModelComponent,
    DemoPipeComponent,
    DemoPopupComponent,
    DemoUIStateComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,

    // soft-ngx
    SoftUIStateModule,
    SoftModalModule,
    SoftModelModule,
    SoftPipeModule,

    SoftApiClientModule.forRoot(),
    SoftAuthModule.forRoot(AuthService),
    SoftModalModule.forRoot(),
    SoftModelModule.forRoot(),
    SoftPopupModule.forRoot(),
    SoftStorageModule.forRoot(),
    SoftUIStateModule.forRoot(),
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
  ]
})
export class AppModule { }
