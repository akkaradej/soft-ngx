import { Injectable, ComponentRef, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef } from '@angular/core';
import { SoftDialog } from './soft-dialog.interface';
import { SoftPopupAnimationModel } from './soft-popup.component';

@Injectable({
  providedIn: 'root',
})
export class SoftDialogService {

  private id = 0;
  private componentRefs: { [key: number]: ComponentRef<any> } = {};

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector,
  ) { }

  addDialog<DataType = any>(component: any, data: DataType, animations: SoftPopupAnimationModel) {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory<SoftDialog>(component)
      .create(this.injector);
    this.applicationRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
    const id = ++this.id;
    this.componentRefs[id] = componentRef;
    componentRef.instance.data = data;
    componentRef.instance.isAnimated = animations.isAnimated;
    componentRef.instance.backdropAnimations = animations.backdropAnimations;
    componentRef.instance.cardAnimations = animations.cardAnimations;
    componentRef.instance.result$.subscribe(() => {
      this.removeDialog(id);
    });

    return componentRef.instance.result$;
  }

  removeDialog(id: number): void {
    if (this.componentRefs[id]) {
      this.applicationRef.detachView(this.componentRefs[id].hostView);
      this.componentRefs[id].destroy();
    }
  }
}
