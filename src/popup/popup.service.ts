import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DialogService } from "ng2-bootstrap-modal";
import { PopupComponent } from './popup.component';

@Injectable()
export class PopupService {

  constructor(
    private dialogService: DialogService) {
  }

  alert(title: string, message = '', colorVar = 'primary', agreeText = 'OK') {
    return this.dialogService.addDialog(PopupComponent, {
      title,
      message,
      colorVar,
      type: 'alert',
      agreeText,
      disagreeText: '',
      isAgreeFirst: true
    });
  }

  confirm(title: string, message = '', colorVar = 'primary', agreeText = 'Yes', disagreeText = 'No', isAgreeFirst = true): Observable<boolean> {
    return this.dialogService.addDialog(PopupComponent, {
      title,
      message,
      colorVar,
      type: 'confirm',
      agreeText,
      disagreeText,
      isAgreeFirst
    });
  }

  confirmDelete(itemName: string, message = 'Warning: This action cannot be undone!', agreeText = 'Yes', disagreeText = 'No', isAgreeFirst = true): Observable<boolean> {
    return this.dialogService.addDialog(PopupComponent, {
      title: `Delete "${itemName}"?`,
      message,
      colorVar: 'danger',
      type: 'confirm',
      agreeText,
      disagreeText,
      isAgreeFirst
    });
  }


}
