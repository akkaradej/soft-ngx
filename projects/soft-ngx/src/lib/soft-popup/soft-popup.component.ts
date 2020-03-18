import { Component } from '@angular/core';
import { Subject, config } from 'rxjs';
import { SoftDialog } from './soft-dialog.interface';
import { trigger, state, style, animate, transition, AnimationEvent } from '@angular/animations';

export interface SoftPopupModel {
  title: string;
  message: string;
  colorVar: string;
  type: 'alert' | 'confirm';
  agreeText: string;
  disagreeText: string;
  isAgreeFirst: boolean;
}

export interface SoftPopupAnimationModel {
  isAnimated: boolean;
  backdropAnimations: any;
  cardAnimations: any;
}

export const softPopupAnimations = [
  trigger('backdrop', [
    state('void', style({ opacity: '{{ voidOpacity }}' }), { params: { voidOpacity: 0 } }),
    state('open', style({ opacity: '{{ openOpacity }}' }), { params: { openOpacity: 1 } }),
    state('closed', style({ opacity: '{{ closedOpacity }}' }), { params: { closedOpacity: 0 } }),
    transition('void => open', animate('{{ openAnimate }}'), { params: { openAnimate: '250ms linear' } }),
    transition('open => closed', animate('{{ closedAnimate }}'), { params: { closedAnimate: '200ms linear' } }),
  ]),
  trigger('card', [
    state('void', style({ opacity: '{{ voidOpacity }}', transform: '{{ voidTransform }}' }), { params: { voidOpacity: 1, voidTransform: 'translateY(-30%)' } }),
    state('open', style({ opacity: '{{ openOpacity }}', transform: '{{ openTransform }}' }), { params: { openOpacity: 1, openTransform: 'translateY(0)' } }),
    state('closed', style({ opacity: '{{ closedOpacity }}', transform: '{{ closedTransform }}' }), { params: { closedOpacity: 0, closedTransform: 'translateY(-30%)' } }),
    transition('void => open', animate('{{ openAnimate }}'), { params: { openAnimate: '300ms ease-out' } }),
    transition('open => closed', animate('{{ closedAnimate }}'), { params: { closedAnimate: '150ms ease-in-out' } }),
  ]),
];

@Component({
  selector: 'soft-popup',
  template: `
    <div
      [@.disabled]="!isAnimated"
      class="modal has-no-footer is-small is-{{ data.colorVar }} is-active">
      <div
        class="modal-background"
        [@backdrop]="{ value: isOpen ? 'open' : 'closed', params: backdropAnimations }"
        (@backdrop.done)="onBackdropAnimationDone($event)"
        (click)="onDismiss()"></div>
      <div
        class="modal-card"
        style="width: 350px;"
        [@card]="{ value: isOpen ? 'open' : 'closed', params: cardAnimations }"
        (@card.done)="onCardAnimationdropDone($event)">
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
  animations: softPopupAnimations,
})
export class SoftPopupComponent implements SoftDialog {

  isOpen = true;
  isConfirm = false;

  data: SoftPopupModel;

  hasAnimation = true;
  backdropAnimations: any;
  cardAnimations: any;

  isAnimated: boolean;
  isBackdropAnimationDone = false;
  isCardAnimationDone = false;

  protected result = new Subject<boolean>();
  public result$ = this.result.asObservable();

  constructor() {
  }

  onConfirm() {
    this.isOpen = false;
    this.isConfirm = true;
    if (!this.isAnimated || !this.hasAnimation) {
      this.result.next(this.isConfirm);
      this.result.complete();
    }
  }

  onDismiss() {
    this.isOpen = false;
    this.isConfirm = false;
    if (!this.isAnimated || !this.hasAnimation) {
      this.result.next(this.isConfirm);
      this.result.complete();
    }
  }

  onBackdropAnimationDone(event: AnimationEvent) {
    if (event.fromState === 'open' && event.toState === 'closed') {
      this.isBackdropAnimationDone = true;
      this.allAnimationDone();
    }
  }

  onCardAnimationdropDone(event: AnimationEvent) {
    if (event.fromState === 'open' && event.toState === 'closed') {
      this.isCardAnimationDone = true;
      this.allAnimationDone();
    }
  }

  allAnimationDone() {
    if (this.isBackdropAnimationDone && this.isCardAnimationDone) {
      this.result.next(this.isConfirm);
      this.result.complete();
    }
  }
}
