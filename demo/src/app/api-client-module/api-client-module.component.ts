import { Component, OnInit } from '@angular/core';
import { ApiClientService } from 'soft-ngx';

import { AuthService } from './auth.service';
import { Auth } from './auth.model';

@Component({
  selector: 'app-api-client-module',
  templateUrl: './api-client-module.component.html',
  styleUrls: ['./api-client-module.component.scss']
})
export class ApiClientModuleComponent implements OnInit {

  posts: any;
  newPost: any;
  comment: any;
  auth: Auth;

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
        console.info(this.authService.isAdmin);
        console.info(this.authService.userId);
        console.info(this.authService.displayName);
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
