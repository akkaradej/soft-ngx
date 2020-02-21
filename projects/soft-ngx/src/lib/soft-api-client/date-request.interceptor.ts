import { Injectable, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { defaultConfig, SoftApiClientConfig } from './soft-api-client.config';
import { userSoftApiClientConfigToken } from './user-config.token';

@Injectable({
  providedIn: 'root',
})
export class DateRequestInterceptor implements HttpInterceptor {

  config = {} as SoftApiClientConfig;

  constructor(
    @Inject(userSoftApiClientConfigToken) userConfig: SoftApiClientConfig,
  ) {
    this.config = Object.assign({}, defaultConfig, userConfig);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    // params
    const keys = request.params.keys();
    const modifiedParams: any = {};
    for (const key of keys) {
      const obj = request.params.get(key) as any;
      if (obj instanceof Date) {
        if (this.config.dateRequestFormatter) {
          modifiedParams[key] = this.config.dateRequestFormatter(obj);
        } else {
          modifiedParams[key] = obj.toISOString();
        }
      }
    }
    if (Object.keys(modifiedParams).length > 0) {
      request = request.clone({
        setParams: modifiedParams,
      });
    }

    // body
    if (request.method === 'POST' || request.method === 'PUT') {
      if (request.body && !(request.body instanceof FormData)) {
        const contentType = request.detectContentTypeHeader();
        if (!contentType || (contentType && contentType.startsWith('application/x-www-form-urlencoded'))) {
          const formatted = this.iterateFormatDate(request.body);
          request = request.clone({
            body: formatted,
          });
        }
      }
    }

    return next.handle(request);
  }

  private iterateFormatDate(obj) {
    let newObj;
    if (Array.isArray(obj)) {
      newObj = [];
    } else {
      newObj = {};
    }
    Object.keys(obj).forEach(key => {
      if (obj[key] instanceof Date) {
        if (this.config.dateRequestFormatter) {
          newObj[key] = this.config.dateRequestFormatter(obj[key]);
        } else {
          newObj[key] = obj[key].toISOString();
        }
      } else if (typeof obj[key] === 'object' && !(obj[key] instanceof FormData) && obj[key]) {
        newObj[key] = this.iterateFormatDate(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  }
}

