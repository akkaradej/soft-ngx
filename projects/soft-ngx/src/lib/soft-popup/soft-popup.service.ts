import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { SoftPopup, SoftPopupComponent, SoftPopupModel, SoftPopupType } from './soft-popup.component';
import { SoftPopupConfig, defaultConfig } from './soft-popup.config';
import { userSoftPopupConfigToken } from './user-config.token';
import { SoftDialogService } from './soft-dialog.service';
import { ActiveToast, ComponentType, IndividualConfig, Toast, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SoftPopupService {

  config = {} as SoftPopupConfig;

  constructor(
    private dialogService: SoftDialogService,
    private toastr: ToastrService,
    @Inject(userSoftPopupConfigToken) userConfig: SoftPopupConfig) {

    this.config = Object.assign({}, defaultConfig, userConfig);
  }

  toast<T = any>(message = '', colorVar?: string, autoClose?: boolean,
    position?: 'bottom-left' | 'bottom-right' | 'bottom-center' | 'bottom-full-width' |
               'top-left' | 'top-right' | 'top-center' | 'top-full-width',
    toastComponent?: ComponentType<T>): ActiveToast<T> {
    
    colorVar = colorVar || this.config.toastColorVar;

    if (!position) {
      if (colorVar === 'danger') {
        position = 'top-full-width';
      } else {
        position = 'bottom-left';
      }
    }

    if (autoClose == null) {
      if (colorVar === 'danger') {
        autoClose = false;
      } else {
        autoClose = true;
      }
    }

    const opt: Partial<IndividualConfig> = {
      toastClass: `ngx-toastr is-${colorVar}`,
      positionClass: `toast-${position}`,
      disableTimeOut: !autoClose,
      closeButton: true,
      tapToDismiss: false,
      enableHtml: true,
    }

    if (toastComponent) {
      opt.toastComponent = toastComponent;
    }

    return this.toastr.show(message, undefined, opt);
  }

  clear(): void {
    this.toastr.clear();
  }

  remove(toastId: number): void {
    this.toastr.remove(toastId);
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
    isAgreeFirst = isAgreeFirst != null ? isAgreeFirst : this.config.isAgreeFirst;

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
    isAgreeFirst = isAgreeFirst != null ? isAgreeFirst : this.config.isAgreeFirst;

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
