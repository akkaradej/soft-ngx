import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  // Configs
  SoftApiClientConfig, SoftAuthServiceConfig, SoftAsyncUIConfig, SoftSkeletonType,
  SoftAuthInterceptorConfig, SoftPopupConfig, SoftStorageConfig, SoftAuthRequestKey, SoftAuthResponseKey,

  // Modules
  SoftNgxModule,

  // Interceptors
  SoftAuthInterceptor, NoCacheInterceptor,

  // Config Tokens
  userSoftApiClientConfigToken, userSoftAuthServiceConfigToken, userSoftAuthInterceptorConfigToken,
  userSoftAsyncUIConfigToken, userRegisteredSkeletonComponentsToken,
  authServiceClassForSoftAuthInterceptorToken,
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
import { SampleSkeletonComponent } from './demo-async-ui/sample-skeleton';
import { DemoTooltipComponent } from './demo-tooltip/demo-tooltip.component';
import { CustomToastComponent } from './demo-popup/custom-toast.component';

export function initApiClientConfig(): SoftApiClientConfig {
  return {
    apiBaseUrl: 'https://jsonplaceholder.typicode.com'
  };
}

export function initAsyncUIConfig(): SoftAsyncUIConfig {
  return {
    busyDelay: 400,
    busyContainerMinHeight: 50,
    minDuration: 0,
  };
}

export function initRegisteredSkeletonComponents(): SoftSkeletonType {
  return {
    sample: SampleSkeletonComponent,
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
    DemoTooltipComponent,
    CustomDialogComponent,
    CustomToastComponent,
    SampleSkeletonComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,

    // Single import at AppModule or CoreModule
    SoftNgxModule.forRoot(),

    //// Single import at SharedModule // => for lazy loading module
    // SoftNgxModule

    //// Selective import at AppModule or CoreModule
    // SoftApiClientModule.forRoot(),
    // SoftAuthModule.forRoot(),
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
  //// If use own AuthInterceptor, not need authServiceClassForSoftAuthInterceptorToken
  // providers: [
  //   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  //   { provide: HTTP_INTERCEPTORS, useClass: NoCacheInterceptor, multi: true },
  // ]
  providers: [
    { provide: authServiceClassForSoftAuthInterceptorToken, useClass: AuthService },
    { provide: HTTP_INTERCEPTORS, useClass: SoftAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NoCacheInterceptor, multi: true },
    { provide: userSoftApiClientConfigToken, useFactory: initApiClientConfig },
    { provide: userSoftAsyncUIConfigToken, useFactory: initAsyncUIConfig },
    { provide: userRegisteredSkeletonComponentsToken, useFactory: initRegisteredSkeletonComponents },
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
})
export class AppModule { }
