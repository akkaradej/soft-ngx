import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

export interface PopupModel {
  title: string;
  message: string;
  colorVar: string;
  type: 'alert' | 'confirm';
  agreeText: string;
  disagreeText: string;
  isAgreeFirst: boolean;
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
          <button type="button" class="delete" aria-label="close"
          (click)="close()">
          </button>
        </header>
        <section class="modal-card-body has-text-centered">
          <div class="message block-2" *ngIf="message">
            <strong class="is-pre-wrap">{{ message }}</strong>
          </div>
          <div *ngIf="type == 'alert'">
            <button class="button is-fat is-{{ colorVar }}" (click)="close()">{{ agreeText }}</button>
          </div>
          <div *ngIf="type == 'confirm'">
            <ng-container *ngIf="isAgreeFirst">
              <button class="button is-fat is-{{ colorVar }}" (click)="confirm()">{{ agreeText }}</button>
              &nbsp;
              <button class="button is-fat is-light" (click)="close()">{{ disagreeText }}</button>
            </ng-container>

            <ng-container *ngIf="!isAgreeFirst">
              <button class="button is-fat is-light" (click)="close()">{{ disagreeText }}</button>
              &nbsp;
              <button class="button is-fat is-{{ colorVar }}" (click)="confirm()">{{ agreeText }}</button>
            </ng-container>
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
  agreeText: string;
  disagreeText: string;
  isAgreeFirst: boolean;

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
