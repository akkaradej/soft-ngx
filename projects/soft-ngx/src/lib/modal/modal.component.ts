import { Component, OnInit, Inject, Input, Output, EventEmitter, ContentChild, Optional } from '@angular/core';

import { WindowClass, windowToken } from '../window';

import { ModalContent } from './modal-content';

@Component({
  selector: 'soft-modal',
  template: `
    <div class="modal {{ modalClass }}"
      [class.is-active]="isOpen">
      <div class="modal-background" (click)="close()"></div>
      <div class="modal-card modal-card-no-footer">
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
  `
})
export class ModalComponent implements OnInit {
  @Input() modalClass = '';

  @Output() opened = new EventEmitter();
  @Output() closed = new EventEmitter();
  @Output() removed = new EventEmitter();

  @ContentChild('modalContent', { static: false }) modalContent: ModalContent;

  // Tip: Use with ngIf for re-create modalContent every time opening
  isOpen = false;

  // Tip: Use with ngIf for prevent modalContent execute before open,
  // and would not re-create modalContent every time opening.
  isFirstOpen = false;

  constructor(
    @Inject(windowToken) protected _window: WindowClass) {
  }

  ngOnInit() {
  }

  open() {
    this.isOpen = true;
    this.isFirstOpen = true;
    this.opened.emit();
    this._window.setTimeout(() => {
      if (this.modalContent && this.modalContent.onModalOpen) {
        this.modalContent.onModalOpen();
      }
    });
  }

  close() {
    this.isOpen = false;
    this.closed.emit();
    if (this.modalContent && this.modalContent.onModalClose) {
      this.modalContent.onModalClose();
    }
  }

  remove() {
    this.isOpen = false;
    this.isFirstOpen = false;
    this.removed.emit();
  }
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modal-title',
  template: '<ng-content></ng-content>'
})
export class ModalTitleComponent { }
