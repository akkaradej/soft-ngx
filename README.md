# SoftNgx

## Installation

Install package from a gzipped tarball 

Download [soft-ngx-0.11.18-beta.tgz](https://github.com/akkaradej/soft-ngx/releases/download/v0.11.18-beta/soft-ngx-0.11.18-beta.tgz) to your project

`yarn add file:soft-ngx-0.11.18-beta.tgz`

## Dependencies

### SoftAsyncUIModule
softBusy - DefaultBusyComponent style with [Trunks UI](https://github.com/akkaradej/trunks-ui)\
softLoading - default loadingClass style with [Trunks UI](https://github.com/akkaradej/trunks-ui)\
softSkel - Built-in skeleton components style with [Placeholder Loading](https://github.com/zalog/placeholder-loading), [Trunks UI](https://github.com/akkaradej/trunks-ui)

`@import "~placeholder-loading/src/scss/placeholder-loading.scss";`\
`@import "~trunks-ui/trunks.scss";`

### SoftModalModule
style with [Trunks UI](https://github.com/akkaradej/trunks-ui)

`@import "~trunks-ui/trunks.scss";`

### SoftPopupModule 
toast() using [ngx-toastr](https://github.com/scttcper/ngx-toastr)\
more style with [Trunks UI](https://github.com/akkaradej/trunks-ui)

`@import "~ngx-toastr/toastr.css;`\
`@import "~trunks-ui/trunks.scss";`

### SoftTooltipModule 
using [tippy.js](https://github.com/atomiks/tippyjs)\
more style with [Trunks UI](https://github.com/akkaradej/trunks-ui)

`@import "~tippy.js/dist/tippy.css";`\
`@import "~placeholder-loading/src/scss/placeholder-loading.scss";`\
`@import "~trunks-ui/trunks.scss";`


## Usage

## Single import

### Single import at AppModule or CoreModule
```
imports: [
  SoftNgxModule.forRoot()
]
```

### Single import at SharedModule (to import SharedModule for lazy loading module)
```
imports: [
  SoftNgxModule
],
exports: [
  SoftNgxModule
],
```

## Selective import

### Selective import at AppModule or CoreModule
```
imports: [
  SoftApiClientModule.forRoot(),
  SoftAsyncUIModule.forRoot(),
  SoftAuthModule.forRoot(),
  SoftPopupModule.forRoot(),
  SoftScrollModule.forRoot(),
  SoftStorageModule.forRoot(),
  SoftModalModule, // => for non-lazy loading module only
  SoftModelModule, // => for non-lazy loading module only
  SoftPipeModule, // => for non-lazy loading module only
  SoftTooltipModule, // => for non-lazy loading module only
]
```

### Selective import at SharedModule (to import SharedModule for lazy loading module)
```
imports: [
  SoftAsyncUIModule,
  SoftModalModule,
  SoftModelModule,
  SoftPipeModule,
  SoftTooltipModule,
],
exports: [
  SoftAsyncUIModule,
  SoftModalModule,
  SoftModelModule,
  SoftPipeModule,
  SoftTooltipModule,
],
```

## Example Configurations

```
export function initSoftApiClientConfig(): SoftApiClientConfig {
  return {
    dateRequestFormatter,
    dateResponseReviver,
  };
}

export function initSoftAuthServiceConfig(): SoftAuthServiceConfig {
  return {
    tokenUrl: environment.config.tokenUrl,
    isOAuth: false,
    isFormData: false,
    isJWT: true,
  };
}

export function initSoftAuthInterceptorConfigToken(): SoftAuthInterceptorConfig {
  return {
    autoRefreshToken: true,
    loginScreenUrl: environment.config.loginScreenUrl,
  };
}

export function initSoftPopupConfig(): SoftPopupConfig {
  return {
    // general
    agreeText: 'Yes',
    disagreeText: 'No',
    // alert
    alertAgreeText: 'OK',
    // delete
    deleteTitleFunc: (itemName: string) => {
      return `Comfirm Deletion`;
    },
    deleteMessageFunc: (itemName: string) => {
      return `Are you sure you want to delete "${itemName}"?`;
    },
  };
}

export function initSoftStorageConfig(): SoftStorageConfig {
  return {
    storagePrefix: environment.config.storagePrefix,
  };
}

const authRequestKey: SoftAuthRequestKey = {
  username: 'username',
  password: 'password',
};

const authResponseKey: SoftAuthResponseKey = {
  access_token: 'token',
};

@NgModule({
  imports: [
    SoftNgxModule.forRoot(),
  ],
  //// If use own AuthInterceptor, not need authServiceClassForSoftAuthInterceptorToken
  // providers: [
  //   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  //   { provide: HTTP_INTERCEPTORS, useClass: DateRequestInterceptor, multi: true },
  //   { provide: HTTP_INTERCEPTORS, useClass: NoCacheInterceptor, multi: true },
  // ]
  providers: [
    { provide: SoftApiErrorHandlerService, useClass: ApiErrorHandlerService },
    { provide: authServiceClassForSoftAuthInterceptorToken, useClass: AuthService },
    { provide: HTTP_INTERCEPTORS, useClass: SoftAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DateRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NoCacheInterceptor, multi: true },
    { provide: userSoftApiClientConfigToken, useFactory: initSoftApiClientConfig },
    { provide: userSoftAuthServiceConfigToken, useFactory: initSoftAuthServiceConfig },
    { provide: userSoftAuthInterceptorConfigToken, useFactory: initSoftAuthInterceptorConfigToken },
    { provide: userSoftAuthRequestKeyToken, useValue: authRequestKey },
    { provide: userSoftAuthResponseKeyToken, useValue: authResponseKey },
    { provide: userSoftPopupConfigToken, useFactory: initSoftPopupConfig },
    { provide: userSoftStorageConfigToken, useFactory: initSoftStorageConfig },
    AuthService,
  ]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule) {

    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}

```

## Example ApiErrorHandlerService

```
@Injectable()
export class ApiErrorHandlerService extends SoftApiErrorHandlerService {

  constructor(
    private popupService: SoftPopupService,
  ) {
    super();
  }
  
  handleError(err: HttpErrorResponse): void {
    this.popupService.alert('Cannot Operate', 'Something wrong, please try again.', 'danger');
  }
}

```

## Start Demo

`yarn install`\
`yarn build_lib`\
`yarn start`
