import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { SoftPopupComponent, SoftPopupModel } from './soft-popup.component';
import { SoftPopupConfig, defaultConfig } from './soft-popup.config';
import { userSoftPopupConfigToken } from './user-config.token';
import { SoftDialogService } from './soft-dialog.service';

@Injectable()
export class SoftPopupService {

  config = {} as SoftPopupConfig;

  constructor(
    private dialogService: SoftDialogService,
    @Inject(userSoftPopupConfigToken) userConfig: SoftPopupConfig) {

    this.config = Object.assign({}, defaultConfig, userConfig);
  }

  alert(title: string, message = '', colorVar?: string, agreeText?: string) {

    colorVar = (colorVar || this.config.alertColorVar) as string;
    agreeText = (agreeText || this.config.alertAgreeText) as string;

    return this.dialogService.addDialog<SoftPopupModel>(SoftPopupComponent, {
      type: 'alert',
      title,
      message,
      colorVar,
      agreeText,
      disagreeText: '',
      isAgreeFirst: true,
    });
  }

  confirm(
    title: string, message = '', colorVar?: string,
    agreeText?: string, disagreeText?: string, isAgreeFirst?: boolean,
  ): Observable<boolean> {

    colorVar = (colorVar || this.config.alertColorVar) as string;
    agreeText = (agreeText || this.config.alertAgreeText) as string;
    disagreeText = (disagreeText || this.config.disagreeText) as string;
    isAgreeFirst = (isAgreeFirst || this.config.isAgreeFirst) as boolean;

    return this.dialogService.addDialog<SoftPopupModel>(SoftPopupComponent, {
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

    return this.dialogService.addDialog<SoftPopupModel>(SoftPopupComponent, {
      type: 'confirm',
      title,
      message,
      colorVar,
      agreeText,
      disagreeText,
      isAgreeFirst,
    });
  }

  custom(component: any, data: any) {
    return this.dialogService.addDialog(component, data);
  }
}
