import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DialogService } from "ng2-bootstrap-modal";
import { PopupComponent, PopupModel } from './popup.component';

@Injectable()
export class PopupService {

  constructor(
    private dialogService: DialogService) {
  }

  alert(title: string, message = '', colorVar = 'primary') {
    return this.dialogService.addDialog(PopupComponent, {
      title,
      message,
      colorVar,
      type: 'alert'
    });
  }

  confirm(title: string, message = '', colorVar = 'primary'): Observable<boolean> {
    return this.dialogService.addDialog(PopupComponent, {
      title,
      message,
      colorVar,
      type: 'confirm'
    });
  }

  confirmDelete(itemName: string, message = 'Warning: This action cannot be undone!'): Observable<boolean> {
    return this.dialogService.addDialog(PopupComponent, {
      title: `Delete "${itemName}"?`,
      message,
      colorVar: 'danger',
      type: 'confirm'
    });
  }


}
