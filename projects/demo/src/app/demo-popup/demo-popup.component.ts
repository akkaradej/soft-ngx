import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { SoftPopupService } from 'soft-ngx';
import { CustomDialogComponent } from './custom-dialog-component';

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

  toast() {
    this.popupService.toast('Hi! Everybody', 'I\'m Simple Toast', 'success');
    this.popupService.toast('I\'m Important Toast, click to close', undefined, 'danger');
  }

  alert() {
    this.popupService.alert('Hi! Everybody', 'I\'m Alert Popup', 'primary');
  }

  confirm() {
    this.popupService.confirm('Are your sure?', '', 'warning')
      .subscribe(result => {
        if (result) {
          window.alert('Sure!');
        }
      });
  }

  confirmActionSubLoading() {
    this.popupService.confirm('Are your sure?', '', 'warning')
      .subscribe(result => {
        if (result) {
          result.actionSub = of(true).pipe(delay(1000)).subscribe();
        }
      });
  }

  confirmManualLoadingClose() {
    this.popupService.confirm('Are your sure?', '', 'warning')
      .subscribe(result => {
        if (result) {
          result.loading();
          of(true).pipe(delay(1000)).subscribe(() => {
            result.close();
          });
        }
      });
  }

  confirmCustomText() {
    this.popupService.confirm('Are your sure?', '', 'warning', 'Sure', 'Not Sure', false)
      .subscribe(result => {
        if (result) {
          window.alert('Sure!');
        }
      });
  }

  delete(product: any) {
    this.popupService.confirmDelete(product.name)
      .subscribe(result => {
        if (result) {
          this.products.splice(this.products.indexOf(product), 1);
        }
      });
  }

  custom() {
    this.popupService.custom(CustomDialogComponent, { say: 'hello' })
      .subscribe(result => {
        if (result) {
          window.alert('Sure!');
        }
      });
  }

}
