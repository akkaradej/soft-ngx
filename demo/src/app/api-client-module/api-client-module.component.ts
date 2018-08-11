import { Component, OnInit } from '@angular/core';
import { ApiClientService, StorageService } from 'soft-ngx';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-api-client-module',
  templateUrl: './api-client-module.component.html',
  styleUrls: ['./api-client-module.component.scss']
})
export class ApiClientModuleComponent implements OnInit {

  posts: any;
  newPost: any;
  comment: any;
  auth: any;

  constructor(
    private apiClientService: ApiClientService,
    private authService: AuthService,
    private storageService: StorageService) {
  }

  ngOnInit() {
  }

  getPosts() {
    this.apiClientService.get('/posts', { userId: 1 }, true)
      .subscribe(posts => {
        this.posts = posts;
      });
  }

  createPost(title: string, message: string) {
    this.apiClientService.post('/posts', { title, body: message, userId: 1 }, {}, true)
      .subscribe(post => {
        this.newPost = post;
      });
  }

  login() {
    this.authService.requestTokenWithPasswordFlow$('uXXXXXX', 'pYYYYYY')
      .subscribe((auth: any) => {
        this.auth = auth;
      });
  }

  expire() {
    this.storageService.setItem('expires_at', 0);
  }

  requestPrivateApi() {
    this.apiClientService.get('/comments/1')
      .subscribe(comment => {
        this.comment = comment;
      });
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  getAccessToken() {
    return this.authService.getAccessToken();
  }

}
