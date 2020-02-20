import { Component, OnInit } from '@angular/core';

import { SoftPopupService } from 'soft-ngx';

@Component({
  selector: 'app-demo-popup',
  templateUrl: './demo-popup.component.html',
  styleUrls: ['./demo-popup.component.scss']
})
export class DemoPopupComponent implements OnInit {
  products = [{ name: 'Product A' }, { name: 'Product B' }];

  constructor(
    private popupService: SoftPopupService) {
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
