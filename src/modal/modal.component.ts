import { Component, OnInit, Inject, Input, Output, EventEmitter, ContentChild } from '@angular/core';

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
          <button class="delete" aria-label="close"
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
  @Input() modalClass: string = '';
  
  @Output('open') onOpen = new EventEmitter();
  @Output('close') onClose = new EventEmitter();
  @Output('remove') onRemove = new EventEmitter();

  @ContentChild('modalContent') modalContent: ModalContent;

  // Tip: Use with ngIf for re-create modalContent every time opening
  isOpen: boolean = false;  
  
  // Tip: Use with ngIf for prevent modalContent execute before open, 
  // and would not re-create modalContent every time opening.
  isFirstOpen: boolean = false; 

  constructor(
    @Inject(windowToken) private window: WindowClass) {
  }

  ngOnInit() {
  }

  open() {
    this.isOpen = true;
    this.isFirstOpen = true;
    this.onOpen.emit();
    this.window.setTimeout(() => {
      if (this.modalContent && this.modalContent.onModalOpen) {
        this.modalContent.onModalOpen();
      }
    });
  }

  close() {
    this.isOpen = false
    this.onClose.emit();
    if (this.modalContent && this.modalContent.onModalClose) {
      this.modalContent.onModalClose();
    }
  }

  remove() {
    this.isOpen = false;
    this.isFirstOpen = false;
    this.onRemove.emit();
  }
}


@Component({
  selector: 'modal-title',
  template: '<ng-content></ng-content>'
})
export class ModalTitleComponent {}
