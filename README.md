# SoftNgx

## Dependencies

### SoftAsyncUIModule
softBusy - DefaultBusyComponent style with [Trunks UI](https://github.com/akkaradej/trunks-ui)\
softLoading - default loadingClass style with [Trunks UI](https://github.com/akkaradej/trunks-ui)\
softSkel - Built-in skeleton components style with [Placeholder Loading](https://github.com/zalog/placeholder-loading), [Trunks UI](https://github.com/akkaradej/trunks-ui)

### SoftModalModule and SoftPopupModule
style with [Trunks UI](https://github.com/akkaradej/trunks-ui)

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
  SoftNgxModule.forRoot(AuthService)
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
  SoftAuthModule.forRoot(AuthService),
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
    pageHeaderResponseKeys: {
      pageCount: 'X-Paging-PageCount',
      totalCount: 'X-Paging-TotalRecordCount',
    },
    dateRequestFormatter,
    dateResponseReviver,
    errorHandler,
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
    SoftNgxModule.forRoot(AuthService),
  ],
  providers: [
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