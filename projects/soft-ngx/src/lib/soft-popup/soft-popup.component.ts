import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { SoftDialog } from './soft-dialog.interface';

export interface SoftPopupModel {
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
    <div class="modal is-small is-{{ data.colorVar }} is-active">
      <div class="modal-background" (click)="onDismiss()"></div>
      <div class="modal-card modal-card-no-footer" style="width: 350px;">
        <header class="modal-card-head">
          <p class="modal-card-title">
            {{ data.title }}
          </p>
          <button type="button" class="delete" aria-label="close"
          (click)="onDismiss()">
          </button>
        </header>
        <section class="modal-card-body has-text-centered">
          <div class="block-2" *ngIf="data.message">
            <strong class="is-pre-wrap">{{ data.message }}</strong>
          </div>
          <div *ngIf="data.type == 'alert'">
            <button class="button is-fat is-{{ data.colorVar }}" (click)="onDismiss()">{{ data.agreeText }}</button>
          </div>
          <div *ngIf="data.type == 'confirm'">
            <ng-container *ngIf="data.isAgreeFirst">
              <button class="button is-fat is-{{ data.colorVar }}" (click)="onConfirm()">{{ data.agreeText }}</button>
              &nbsp;
              <button class="button is-fat is-light" (click)="onDismiss()">{{ data.disagreeText }}</button>
            </ng-container>

            <ng-container *ngIf="!data.isAgreeFirst">
              <button class="button is-fat is-light" (click)="onDismiss()">{{ data.disagreeText }}</button>
              &nbsp;
              <button class="button is-fat is-{{ data.colorVar }}" (click)="onConfirm()">{{ data.agreeText }}</button>
            </ng-container>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class SoftPopupComponent implements SoftDialog {

  data: SoftPopupModel;

  protected result = new Subject<boolean>();
  public result$ = this.result.asObservable();

  constructor() {
  }

  onConfirm() {
    this.result.next(true);
    this.result.complete();
  }

  onDismiss() {
    this.result.next(false);
    this.result.complete();
  }
}
