import { Component } from '@angular/core';
import { SoftPopupComponent, SoftDialog } from 'soft-ngx';

@Component({
  selector: 'app-custom-dialog',
  template: `
    <div class="modal is-active">
      <div class="modal-background" (click)="onDismiss()"></div>
      <div class="modal-content">
        <div class="box">
          <div class="block">
            <div>Custom Dialog</div>
            <div>data = {{ data | json }}</div>
          </div>
          <div class="buttons">
            <button class="button" (click)="onConfirm()">OK</button>
            <button class="button" (click)="onDismiss()">Cancel</button>
          </div>
        </div>
      </div>
      <button class="modal-close is-large" (click)="onDismiss()"></button>
    </div>
  `,
  styles: [],
})
export class CustomDialogComponent extends SoftPopupComponent implements SoftDialog {

  data: any;

}
