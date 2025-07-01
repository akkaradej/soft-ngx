import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SoftApiClientService, SoftStorageService } from 'soft-ngx';

import { AuthService } from './auth.service';

@Component({
    selector: 'app-demo-api-client',
    templateUrl: './demo-api-client.component.html',
    styleUrls: ['./demo-api-client.component.scss'],
    standalone: false
})
export class DemoApiClientComponent implements OnInit {

  posts: any;
  newPost: any;
  comment: any;
  auth: any;

  constructor(
    private apiClientService: SoftApiClientService,
    private authService: AuthService,
    private storageService: SoftStorageService) {
  }

  ngOnInit() {
  }

  getPosts() {
    this.apiClientService.get('/posts', { userId: 1 }, new HttpHeaders({ Authorization: 'Bearer XYZ' }), true)
      .subscribe(posts => {
        this.posts = posts;
      });
  }

  createPost(title: string, message: string) {
    this.apiClientService.post('/posts', { title, body: message, userId: 1 }, {}, undefined, true)
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
