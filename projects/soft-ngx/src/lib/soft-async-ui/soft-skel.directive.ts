import { Directive, TemplateRef, ViewContainerRef, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { DefaultSkeletonComponent } from './skeletons/default-skeleton.component';
import { BarChartSkeletonComponent } from './skeletons/bar-chart-skeleton.component';
import { PieChartSkeletonComponent } from './skeletons/pie-chart-skeleton.component';
import { TableSkeletonComponent } from './skeletons/table-skeleton.component';
import { SummarySkeletonComponent } from './skeletons/summary-skeleton.component';
import { userRegisteredSkeletonComponentsToken, userSoftAsyncUIConfigToken } from './user-config.token';
import { defaultConfig, SoftAsyncUIConfig, SoftSkeletonType } from './soft-async-ui.config';

@Directive({
    selector: '[softSkel]',
    standalone: false
})
export class SoftSkelDirective implements OnChanges {

  config: SoftAsyncUIConfig;
  builtInTypes: SoftSkeletonType = {
    default: DefaultSkeletonComponent,
    'bar-chart': BarChartSkeletonComponent,
    'pie-chart': PieChartSkeletonComponent,
    summary: SummarySkeletonComponent,
    table: TableSkeletonComponent,
  };

  @Input() softSkel: Subscription;
  @Input() softSkelDelay: number;
  @Input() softSkelType: string;
  @Input() softSkelTemplate: TemplateRef<any>;
  @Input() softSkelContext: any;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Inject(userRegisteredSkeletonComponentsToken) registeredSkeletonComponents: SoftSkeletonType,
    @Inject(userSoftAsyncUIConfigToken) userConfig: SoftAsyncUIConfig
  ) {
    this.config = Object.assign({}, defaultConfig, userConfig);
    if (registeredSkeletonComponents) {
      Object.assign(this.builtInTypes, registeredSkeletonComponents);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.softSkel && changes.softSkel.currentValue) {
      this.viewContainer.clear();
      const beginningTime = new Date().getTime();
      const delay = this.softSkelDelay ?? this.config.skelDelay;

      const timeout = window.setTimeout(() => {
        this.showSkeleton();
      }, delay);

      new Promise((resolve) => {
        this.softSkel.add(() => resolve(true));
      }).then(() => {
        window.clearTimeout(timeout);
        const executedTime = new Date().getTime() - beginningTime;
        if (executedTime > delay && executedTime < delay + this.config.skelMinDisplayTime) {
          window.setTimeout(() => {
            this.showContent();
          }, this.config.skelMinDisplayTime);
        } else {
          this.showContent();
        }
      }).catch(() => {
        this.viewContainer.clear();
      });
    }
  }

  private showSkeleton() {
    if (this.softSkelType) {
      const componentRef = this.viewContainer.createComponent(this.builtInTypes[this.softSkelType]);
      (componentRef.instance as any).context = this.softSkelContext;
    } else if (this.softSkelTemplate) {
      this.viewContainer.createEmbeddedView(this.softSkelTemplate, this.softSkelContext);
    } else {
      this.viewContainer.createComponent(this.builtInTypes.default);
    }
  }

  private showContent() {
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(this.templateRef);
  }

}
