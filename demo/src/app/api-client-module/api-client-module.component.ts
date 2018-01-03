import { Component, OnInit } from '@angular/core';

import { ApiClientService, AuthService, Auth } from 'soft-ngx';

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
    private authService: AuthService) { 
  }

  ngOnInit() {
  }

  getPosts() {
    this.apiClientService.get('posts', { userId: 1 }, {}, true)
      .subscribe(posts => {
        this.posts = posts;
      });
  }

  createPost(title: string, message: string) {
    this.apiClientService.post('posts', { title, body: message, userId: 1 }, {}, true)
      .subscribe(post => {
        this.newPost = post;
      });
  }

  login() {
    this.authService.login$('uXXXXXX', 'pYYYYYY')
      .subscribe((auth: Auth) => {
        this.auth = auth;
      });
  }

  logout() {
    this.authService.logout();
  }

  requestPrivateApi() {
    this.apiClientService.get('comments/1')
      .subscribe(comment => {
        this.comment = comment;
      });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  getAccessToken() {
    return this.authService.getAccessToken();
  }

}
