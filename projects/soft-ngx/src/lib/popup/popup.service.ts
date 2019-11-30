import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { DialogService } from 'ng2-bootstrap-modal';
import { PopupComponent } from './popup.component';
import { PopupConfig, defaultConfig } from './popup.config';
import { userPopupConfigToken } from './user-config.token';

@Injectable()
export class PopupService {

  config = {} as PopupConfig;

  constructor(
    private dialogService: DialogService,
    @Inject(userPopupConfigToken) userConfig: PopupConfig) {

    this.config = Object.assign({}, defaultConfig, userConfig);
  }

  alert(title: string, message = '', colorVar?: string, agreeText?: string) {

    colorVar = (colorVar || this.config.alertColorVar) as string;
    agreeText = (agreeText || this.config.alertAgreeText) as string;

    return this.dialogService.addDialog(PopupComponent, {
      type: 'alert',
      title,
      message,
      colorVar,
      agreeText,
      disagreeText: '',
      isAgreeFirst: true,
    });
  }

  confirm(title: string, message = '', colorVar?: string,
          agreeText?: string, disagreeText?: string, isAgreeFirst?: boolean,
  ): Observable<boolean> {

    colorVar = (colorVar || this.config.alertColorVar) as string;
    agreeText = (agreeText || this.config.alertAgreeText) as string;
    disagreeText = (disagreeText || this.config.disagreeText) as string;
    isAgreeFirst = (isAgreeFirst || this.config.isAgreeFirst) as boolean;

    return this.dialogService.addDialog(PopupComponent, {
      type: 'confirm',
      title,
      message,
      colorVar,
      agreeText,
      disagreeText,
      isAgreeFirst,
    });
  }

  confirmDelete(
    itemName: string, title?: string, message?: string, colorVar?: string,
    agreeText?: string, disagreeText?: string, isAgreeFirst?: boolean,
  ): Observable<boolean> {

    title = (title || (this.config.deleteTitleFunc && this.config.deleteTitleFunc(itemName))) as string;
    message = (message || (this.config.deleteMessageFunc && this.config.deleteMessageFunc(itemName))) as string;
    colorVar = (colorVar || this.config.alertColorVar) as string;
    agreeText = (agreeText || this.config.alertAgreeText) as string;
    disagreeText = (disagreeText || this.config.disagreeText) as string;
    isAgreeFirst = (isAgreeFirst || this.config.isAgreeFirst) as boolean;

    return this.dialogService.addDialog(PopupComponent, {
      type: 'confirm',
      title,
      message,
      colorVar,
      agreeText,
      disagreeText,
      isAgreeFirst,
    });
  }

  custom(component: any, options: any) {
    return this.dialogService.addDialog(component, options);
  }
}
