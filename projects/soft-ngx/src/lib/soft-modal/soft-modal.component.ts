import { Component, OnInit, Input, Output, EventEmitter, ContentChild } from '@angular/core';

import { SoftModalContent } from './soft-modal-content';

@Component({
  selector: 'soft-modal',
  template: `
    <div class="modal has-no-footer {{ modalClass }}"
      [class.is-active]="isOpen">
      <div class="modal-background" (click)="close()"></div>
      <div class="modal-card">
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
})
export class SoftModalComponent implements OnInit {
  @Input() modalClass = '';

  @Output() opened = new EventEmitter();
  @Output() closed = new EventEmitter();
  @Output() removed = new EventEmitter();

  @ContentChild('modalContent') modalContent: SoftModalContent;

  // Tip: Use with ngIf .isOpen for re-create modalContent every time opening
  isOpen = false;

  // Tip: Use with ngIf .isFirstOpen for prevent modalContent execute before open,
  // and would not re-create modalContent every time opening.
  isFirstOpen = false;

  ngOnInit() {
  }

  open() {
    this.isOpen = true;
    this.isFirstOpen = true;
    this.opened.emit();
    window.setTimeout(() => {
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
  template: '<ng-content></ng-content>',
})
export class ModalTitleComponent { }
