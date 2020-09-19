import { Directive, TemplateRef, ViewContainerRef, ComponentFactoryResolver, Input, OnChanges, SimpleChanges, Inject, Type } from '@angular/core';
import { Subscription } from 'rxjs';
import { DefaultSkeletonComponent } from './skeletons/default-skeleton.component';
import { BarChartSkeletonComponent } from './skeletons/bar-chart-skeleton.component';
import { PieChartSkeletonComponent } from './skeletons/pie-chart-skeleton.component';
import { TableSkeletonComponent } from './skeletons/table-skeleton.component';
import { SummarySkeletonComponent } from './skeletons/summary-skeleton.component';
import { userRegisteredSkeletonComponentsToken } from './user-config.token';
import { SoftSkeletonType } from './soft-async-ui.config';

@Directive({
  selector: '[softSkel]',
})
export class SoftSkelDirective implements OnChanges {

  builtInTypes: SoftSkeletonType = {
    default: DefaultSkeletonComponent,
    'bar-chart': BarChartSkeletonComponent,
    'pie-chart': PieChartSkeletonComponent,
    summary: SummarySkeletonComponent,
    table: TableSkeletonComponent,
  };

  @Input() softSkel: Subscription;
  @Input() softSkelType: string;
  @Input() softSkelTemplate: TemplateRef<any>;
  @Input() softSkelContext: any;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    @Inject(userRegisteredSkeletonComponentsToken) registeredSkeletonComponents: SoftSkeletonType,
  ) {
    if (registeredSkeletonComponents) {
      Object.assign(this.builtInTypes, registeredSkeletonComponents);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.softSkel && changes.softSkel.currentValue) {
      this.viewContainer.clear();
      if (this.softSkelType) {
        const componentRef = this.viewContainer.createComponent(this.componentFactoryResolver.resolveComponentFactory(this.builtInTypes[this.softSkelType]));
        (componentRef.instance as any).context = this.softSkelContext;
      } else if (this.softSkelTemplate) {
        this.viewContainer.createEmbeddedView(this.softSkelTemplate, this.softSkelContext);
      } else {
        this.viewContainer.createComponent(this.componentFactoryResolver.resolveComponentFactory(this.builtInTypes.default));
      }

      new Promise((resolve) => {
        this.softSkel.add(resolve);
      }).then(() => {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef);
      }).catch(() => {
        this.viewContainer.clear();
      });
    }
  }

}
