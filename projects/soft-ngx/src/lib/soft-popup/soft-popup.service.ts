import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { SoftPopup, SoftPopupComponent, SoftPopupModel, SoftPopupType } from './soft-popup.component';
import { SoftPopupConfig, defaultConfig } from './soft-popup.config';
import { userSoftPopupConfigToken } from './user-config.token';
import { SoftDialogService } from './soft-dialog.service';

@Injectable({
  providedIn: 'root',
})
export class SoftPopupService {

  config = {} as SoftPopupConfig;

  constructor(
    private dialogService: SoftDialogService,
    @Inject(userSoftPopupConfigToken) userConfig: SoftPopupConfig) {

    this.config = Object.assign({}, defaultConfig, userConfig);
  }

  alert(title: string, message = '', colorVar?: string, 
    agreeText?: string,
  ): Observable<SoftPopup | null> {

    colorVar = colorVar || this.config.alertColorVar;
    agreeText = agreeText || this.config.alertAgreeText;

    return this.dialogService.addDialog<SoftPopupModel>(SoftPopupComponent, {
      type: SoftPopupType.Alert,
      title,
      message,
      colorVar,
      agreeText,
      disagreeText: '',
      isAgreeFirst: true,
    }, {
      isAnimated: this.config.isAnimated,
      backdropAnimations: this.config.backdropAnimations,
      cardAnimations: this.config.cardAnimations,
    });
  }

  confirm(
    title: string, message = '', colorVar?: string,
    agreeText?: string, disagreeText?: string, isAgreeFirst?: boolean,
  ): Observable<SoftPopup | null> {

    colorVar = colorVar || this.config.confirmColorVar;
    agreeText = agreeText || this.config.agreeText;
    disagreeText = disagreeText || this.config.disagreeText;
    isAgreeFirst = isAgreeFirst !== undefined ? isAgreeFirst : this.config.isAgreeFirst;

    return this.dialogService.addDialog<SoftPopupModel>(SoftPopupComponent, {
      type: SoftPopupType.Confirm,
      title,
      message,
      colorVar,
      agreeText,
      disagreeText,
      isAgreeFirst,
    }, {
      isAnimated: this.config.isAnimated,
      backdropAnimations: this.config.backdropAnimations,
      cardAnimations: this.config.cardAnimations,
    });
  }

  confirmDelete(
    itemName: string, title?: string, message?: string, colorVar?: string,
    agreeText?: string, disagreeText?: string, isAgreeFirst?: boolean,
  ): Observable<SoftPopup | null> {

    title = title || (this.config.deleteTitleFunc && this.config.deleteTitleFunc(itemName));
    message = message || (this.config.deleteMessageFunc && this.config.deleteMessageFunc(itemName));
    colorVar = colorVar || this.config.deleteColorVar;
    agreeText = agreeText || this.config.agreeText;
    disagreeText = disagreeText || this.config.disagreeText;
    isAgreeFirst = isAgreeFirst !== undefined ? isAgreeFirst : this.config.isAgreeFirst;

    return this.dialogService.addDialog<SoftPopupModel>(SoftPopupComponent, {
      type: SoftPopupType.Confirm,
      title,
      message,
      colorVar,
      agreeText,
      disagreeText,
      isAgreeFirst,
    }, {
      isAnimated: this.config.isAnimated,
      backdropAnimations: this.config.backdropAnimations,
      cardAnimations: this.config.cardAnimations,
    });
  }

  custom(component: any, data: any): Observable<SoftPopup | null> {
    return this.dialogService.addDialog(component, data, {
      isAnimated: this.config.isAnimated,
      backdropAnimations: this.config.backdropAnimations,
      cardAnimations: this.config.cardAnimations,
    });
  }
}
