import { Injectable, ComponentRef, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef } from '@angular/core';
import { Dialog } from './dialog.interface';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private id = 0;
  private componentRefs: { [key: number]: ComponentRef<any> } = {};

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  addDialog<DataType = any>(component: any, data: DataType) {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory<Dialog>(component)
      .create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
    const id = ++this.id;
    this.componentRefs[id] = componentRef;
    componentRef.instance.data = data;
    return componentRef.instance.result$.pipe(
      tap(() => {
        this.removeDialog(id);
      })
    );
  }

  removeDialog(id: number): void {
    if (this.componentRefs[id]) {
      this.appRef.detachView(this.componentRefs[id].hostView);
      this.componentRefs[id].destroy();
    }
  }
}
