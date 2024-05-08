import { Injectable, ComponentRef, ViewContainerRef } from '@angular/core';
import { SoftDialog } from './soft-dialog.interface';
import { SoftPopupAnimationModel } from './soft-popup.component';

@Injectable({
  providedIn: 'root',
})
export class SoftDialogService {

  viewContainerRef: ViewContainerRef;

  private id = 0;
  private componentRefs: { [key: number]: ComponentRef<any> } = {};
  
  setContainerRef(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  addDialog<DataType = any>(component: any, data: DataType, animations: SoftPopupAnimationModel) {
    if (!this.viewContainerRef) {
      throw 'Please setContainerRef(viewContainerRef) e.g. dialogService.setContainerRef(viewContainerRef); // #app.component.ts';
    }
    (document.activeElement as HTMLElement)?.blur();
    const componentRef = this.viewContainerRef.createComponent<SoftDialog>(component);;
    this.hideHtmlScrollbar();

    const id = ++this.id;
    this.componentRefs[id] = componentRef;
    componentRef.instance.modalId = this.generateModalId();
    componentRef.instance.data = data;
    componentRef.instance.isAnimated = animations.isAnimated;
    componentRef.instance.backdropAnimations = animations.backdropAnimations;
    componentRef.instance.cardAnimations = animations.cardAnimations;
    componentRef.instance.dispose = () => {
      this.removeDialog(id);
    }
    return componentRef.instance.result$;
  }

  removeDialog(id: number): void {
    if (this.componentRefs[id]) {
      this.resetHtmlScrollbar(this.componentRefs[id].instance.modalId);
      this.componentRefs[id].destroy();
      delete this.componentRefs[id];
    }
  }

  clear(): void {
    const keys = Object.keys(this.componentRefs);
    for (const id of keys) {
      this.removeDialog(+id);
    }
  }

  generateModalId() {
    return `modal-${(Math.random() + '' + new Date().getTime()).substr(2)}`;
  }

  hideHtmlScrollbar() {
    if (window.getComputedStyle(document.documentElement).overflowX === 'scroll') {
      document.documentElement.style.overflowX = 'hidden';
    }
    if (window.getComputedStyle(document.documentElement).overflowY === 'scroll') {
      document.documentElement.style.overflowY = 'hidden';
      if (window.navigator.userAgent.indexOf('Windows') > -1) {
        document.documentElement.style.paddingRight = '17px';
      }
    }
  }

  resetHtmlScrollbar(modalId: string) {
    if (!document.querySelector(`.modal.is-active:not(#${modalId})`)) {
      document.documentElement.style.overflowX = '';
      document.documentElement.style.overflowY = '';
      document.documentElement.style.paddingRight = '';
    }
  }

}
