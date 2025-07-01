import { Component, ViewContainerRef } from '@angular/core';
import { SoftDialogService } from 'soft-ngx';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: [],
    standalone: false
})
export class AppComponent {
  constructor(
    viewContainerRef: ViewContainerRef,
    dialogService: SoftDialogService,
  ) {
    dialogService.setContainerRef(viewContainerRef);
  }
}
