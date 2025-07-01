import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Toast } from 'ngx-toastr';

@Component({
    selector: 'custom-toast-component',
    template: `
    <div>
      <div>{{ message }}</div>
      <div class="text-right">
        <button 
          class="button" 
          (click)="action($event)">
          {{ buttonText }}
        </button>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `],
    animations: [
        trigger('flyInOut', [
            state('inactive', style({ opacity: 0 })),
            state('active', style({ opacity: 1 })),
            state('removed', style({ opacity: 0 })),
            transition('inactive => active', animate('{{ easeTime }}ms {{ easing }}')),
            transition('active => removed', animate('{{ easeTime }}ms {{ easing }}'))
        ])
    ],
    standalone: false
})
export class CustomToastComponent extends Toast {

  buttonText = 'Action';

  action(event: Event) {
    event.stopPropagation();
    this.buttonText = 'Actioning...';
    this.toastPackage.triggerAction(() => this.remove());
    return false;
  }
}