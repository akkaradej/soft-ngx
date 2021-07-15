import { Component, OnInit, Input, Output, EventEmitter, ContentChild, Inject, OnDestroy } from '@angular/core';
import { AnimationEvent } from '@angular/animations';

import { SoftModalContent } from './soft-modal-content';
import { softPopupAnimations } from '../soft-popup/soft-popup.component';
import { userSoftPopupConfigToken } from '../soft-popup/user-config.token';
import { SoftPopupConfig, defaultConfig } from '../soft-popup/soft-popup.config';

@Component({
  selector: 'soft-modal',
  template: `
    <div
      [@.disabled]="!isAnimated"
      class="modal has-no-footer {{ modalClass }}"
      [class.is-active]="isOpen">
      <div
        [@backdrop]="{ value: animationState, params: backdropAnimations }"
        (@backdrop.done)="onBackdropAnimationDone($event)"
        class="modal-background"
        (click)="close()">
      </div>
      <div
        [@card]="{ value: animationState, params: cardAnimations }"
        (@card.done)="onCardAnimationdropDone($event)"
        class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            <ng-content select="modal-title"></ng-content>
          </p>
          <button type="button" class="delete" aria-label="close"
           (click)="close()">
          </button>
        </header>
        <section class="modal-card-body">
          <ng-content></ng-content>
        </section>
      </div>
    </div>
  `,
  animations: softPopupAnimations,
})
export class SoftModalComponent implements OnInit, OnDestroy {
  @Input() modalClass = '';

  @Output() opened = new EventEmitter();
  @Output() closed = new EventEmitter();
  @Output() removed = new EventEmitter();

  @ContentChild('modalContent') modalContent: SoftModalContent;

  // Tip: Use with ngIf modal.isOpen for re-create modalContent every time opening
  isOpen = false;

  // Tip: Use with ngIf modal.isFirstOpen for prevent modalContent execute before open,
  // and would not re-create modalContent every time opening.
  isFirstOpen = false;

  // animations
  isAnimated: boolean;
  backdropAnimations: any;
  cardAnimations: any;
  animationState: 'open' | 'closed' | 'void' = 'void';
  private isBackdropAnimationDone = false;
  private isCardAnimationDone = false;

  constructor(
    @Inject(userSoftPopupConfigToken) userConfig: SoftPopupConfig,
  ) {
    const config: SoftPopupConfig = Object.assign({}, defaultConfig, userConfig);
    this.isAnimated = config.isAnimated;
    this.backdropAnimations = config.backdropAnimations;
    this.cardAnimations = config.cardAnimations;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.remove();
  }

  open() {
    this.isOpen = true;
    this.isFirstOpen = true;
    this.animationState = 'open';
    this.opened.emit();
    window.setTimeout(() => {
      if (this.modalContent && this.modalContent.onModalOpen) {
        this.modalContent.onModalOpen();
      }
      if (document.querySelector('.modal.is-active')) {
        document.documentElement.classList.add('is-overflow-hidden');
      }
    });
  }

  close() {
    this.animationState = 'closed';
    if (!this.isAnimated) {
      this.isOpen = false;
      this.closed.emit();
      window.setTimeout(() => {
        if (this.modalContent && this.modalContent.onModalClose) {
          this.modalContent.onModalClose();
        }
        if (!document.querySelector('.modal.is-active')) {
          document.documentElement.classList.remove('is-overflow-hidden');
        }
      });
    }
  }

  remove() {
    this.isOpen = false;
    this.isFirstOpen = false;
    this.removed.emit();
    window.setTimeout(() => {
      if (!document.querySelector('.modal.is-active')) {
        document.documentElement.classList.remove('is-overflow-hidden');
      }
    });
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

  private allAnimationDone() {
    if (this.isBackdropAnimationDone && this.isCardAnimationDone) {
      this.isOpen = false;
      this.isBackdropAnimationDone = false;
      this.isCardAnimationDone = false;
      this.animationState = 'void';
      this.closed.emit();
      window.setTimeout(() => {
        if (this.modalContent && this.modalContent.onModalClose) {
          this.modalContent.onModalClose();
        }
        if (!document.querySelector('.modal.is-active')) {
          document.documentElement.classList.remove('is-overflow-hidden');
        }
      });
    }
  }
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modal-title',
  template: '<ng-content></ng-content>',
})
export class ModalTitleComponent { }
