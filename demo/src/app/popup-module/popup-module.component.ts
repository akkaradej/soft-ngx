import { Component, OnInit } from '@angular/core';

import { PopupService } from 'soft-ngx';

@Component({
  selector: 'app-popup-module',
  templateUrl: './popup-module.component.html',
  styleUrls: ['./popup-module.component.scss']
})
export class PopupModuleComponent implements OnInit {
  products = [{ name: 'Product A' }, { name: 'Product B' }];

  constructor(
    private popupService: PopupService) {
  }

  ngOnInit() {
  }

  alert() {
    this.popupService.alert('Hi! Everybody', 'I\'m Alert Popup', 'primary');
  }

  confirm() {
    this.popupService.confirm('Are your sure?', '', 'warning')
      .subscribe((result: boolean) => {
        if (result) {
          window.alert('Sure!');
        }
      });
  }

  confirmCustomText() {
    this.popupService.confirm('Are your sure?', '', 'warning', 'Sure', 'Not Sure', false)
      .subscribe((result: boolean) => {
        if (result) {
          window.alert('Sure!');
        }
      });
  }

  delete(product: any) {
    this.popupService.confirmDelete(product.name)
      .subscribe((result: boolean) => {
        if (result) {
          this.products.splice(this.products.indexOf(product), 1);
        }
      });
  }

}
