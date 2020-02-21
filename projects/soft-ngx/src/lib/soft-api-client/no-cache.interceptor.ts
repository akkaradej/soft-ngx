import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoCacheInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    if (request.method === 'GET') {
      const customRequest = request.clone({
        headers: request.headers.set('Cache-Control', 'no-cache')
          .set('Pragma', 'no-cache'),
      });
      return next.handle(customRequest);
    }

    return next.handle(request);
  }
}
