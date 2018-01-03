import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams, HttpRequest } from '@angular/common/http';

import { ApiClientModule, ApiClientConfig, ApiClientService } from './../soft-ngx';
import { windowToken } from './../src/window';

const apiClientConfig: ApiClientConfig = {
  apiBaseUrl: 'https://example.com',
  authApiUrl: 'https://example.com/auth',
  loginScreenUrl: 'https://example.com/login',
  storagePrefix: 'test-',
}

describe('ApiClientService', () => {

  let windowMock: any;

  beforeEach(() => {
    windowMock = {
      location: {},
      setTimeout: window.setTimeout,
      clearTimeout: window.clearTimeout
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ApiClientModule.forRoot(apiClientConfig)
      ],
      providers: [
        { provide: windowToken, useValue: windowMock } 
      ]
    });
  });

  it('should be request GET api',
    async(
      inject([ApiClientService, HttpTestingController],
        (apiClientService: ApiClientService, backend: HttpTestingController) => {
          apiClientService.get('posts', { userId: 2 }, {}, true).subscribe();
          backend.expectOne((req: HttpRequest<any>) => {
            return req.method == 'GET'
              && req.urlWithParams == `${apiClientConfig.apiBaseUrl}/posts?userId=2`
              && req.body == '';
          });
        }
      )
    )
  );

  it('should be request POST api',
    async(
      inject([ApiClientService, HttpTestingController],
        (apiClientService: ApiClientService, backend: HttpTestingController) => {
          apiClientService.post('posts', { title: 'tt', message: 'msg' }, {}, true).subscribe();
          backend.expectOne((req: HttpRequest<any>) => {
            return req.method == 'POST'
              && req.urlWithParams == `${apiClientConfig.apiBaseUrl}/posts`
              && req.body.title == 'tt'
              && req.body.message == 'msg';
          });
        }
      )
    )
  );

  it('should be request PUT api',
    async(
      inject([ApiClientService, HttpTestingController],
        (apiClientService: ApiClientService, backend: HttpTestingController) => {
          apiClientService.put('posts/2', { title: 'tt', message: 'msg' }, {}, true).subscribe();
          backend.expectOne((req: HttpRequest<any>) => {
            return req.method == 'PUT'
              && req.urlWithParams == `${apiClientConfig.apiBaseUrl}/posts/2`
              && req.body.title == 'tt'
              && req.body.message == 'msg';
          });
        }
      )
    )
  );

  it('should be request DELETE api',
    async(
      inject([ApiClientService, HttpTestingController],
        (apiClientService: ApiClientService, backend: HttpTestingController) => {
          apiClientService.delete('posts/2', { permanent: 'yes' }, true).subscribe();
          backend.expectOne((req: HttpRequest<any>) => {
            return req.method == 'DELETE'
              && req.urlWithParams == `${apiClientConfig.apiBaseUrl}/posts/2?permanent=yes`
              && req.body == '';
          });
        }
      )
    )
  );

  it('should be auto refresh token',
    async(
      inject([ApiClientService, HttpTestingController],
        (apiClientService: ApiClientService, backend: HttpTestingController) => {
          window.localStorage.clear();
          apiClientService.get('posts').subscribe();
          backend.expectOne((req: HttpRequest<any>) => {
            return req.method == 'POST'
              && req.urlWithParams == `${apiClientConfig.authApiUrl}`;
          });
        }
      )
    )
  );

  it('should be redirect to login url when refresh token fail',
    async(
      inject([ApiClientService, HttpTestingController],
        (apiClientService: ApiClientService, backend: HttpTestingController) => {
          window.localStorage.clear();
          apiClientService.get('posts').subscribe(() => {
            expect(windowMock.location.href).toContain(`${apiClientConfig.loginScreenUrl}`);
          });
          backend.expectOne(`${apiClientConfig.authApiUrl}`)
            .flush({}, { status: 401, statusText: 'Unauthorized' });
        }
      )
    )
  );

});
