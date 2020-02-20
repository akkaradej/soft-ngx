import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DateRequestInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    if (request.method === 'GET') {
      const keys = request.params.keys();
      const modifiedParams: any = {};
      for (const key of keys) {
        const obj = request.params.get(key) as any;
        if (obj instanceof Date) {
          modifiedParams[key] = obj.toISOString();
        }
      }
      if (Object.keys(modifiedParams).length > 0) {
        request = request.clone({
          setParams: modifiedParams,
        });
      }
    }
    return next.handle(request);
  }
}
