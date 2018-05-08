import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

export interface PopupModel {
  title: string;
  message: string;
  colorVar: string;
  type: 'alert' | 'confirm';
}

@Component({
  selector: 'soft-popup',
  template: `
    <div class="modal is-small is-{{ colorVar }} is-active">
      <div class="modal-background" (click)="close()"></div>
      <div class="modal-card modal-card-no-footer" style="width: 350px;">
        <header class="modal-card-head">
          <p class="modal-card-title">
            {{ title }}
          </p>
          <button class="delete" aria-label="close"
          (click)="close()">
          </button>
        </header>
        <section class="modal-card-body has-text-centered">
          <div class="is-margin-bottom" *ngIf="message">
            <strong>{{ message }}</strong>
          </div>
          <div *ngIf="type == 'alert'">
            <button class="button is-fat is-{{ colorVar }}" (click)="close()">OK</button>
          </div>
          <div *ngIf="type == 'confirm'">
            <button class="button is-fat is-{{ colorVar }}" (click)="confirm()">Yes</button>
            &nbsp;
            <button class="button is-fat is-light" (click)="close()">No</button>
          </div>
        </section>
      </div>
    </div>
  `
})
export class PopupComponent extends DialogComponent<PopupModel, boolean> implements PopupModel {
  title: string;
  message: string;
  colorVar: string;
  type: 'alert' | 'confirm';

  constructor(dialogService: DialogService) {
    super(dialogService);
  }
  confirm() {
    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code 
    this.result = true;
    this.close();
  }
}