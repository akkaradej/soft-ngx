import { Component } from '@angular/core';
import { SoftPopupComponent, SoftDialog } from 'soft-ngx';
import { softPopupAnimations } from 'projects/soft-ngx/src/lib/soft-popup/soft-popup.component';

@Component({
  selector: 'app-custom-dialog',
  template: `
    <div [@.disabled]="!isAnimated"
      id="{{ modalId }}"
      class="modal is-active">
      <div
        class="modal-background"
        [@backdrop]="{ value: animationState, params: backdropAnimations }"
        (@backdrop.done)="onBackdropAnimationDone($event)"
        (click)="onDismiss()"
      >
      </div>
      <div
        class="modal-content"
        [@card]="{ value: animationState, params: cardAnimations }"
        (@card.done)="onCardAnimationdropDone($event)"
      >
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
  animations: softPopupAnimations,
})
export class CustomDialogComponent extends SoftPopupComponent implements SoftDialog {

  modalId: string;
  data: any;
  hasAnimation = true;

}
