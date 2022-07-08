import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders, Type } from '@angular/core';

import { SoftAsyncUIConfig, SoftSkeletonType } from './soft-async-ui.config';
import { SoftBusyDirective } from './soft-busy.directive';
import { SoftDisabledDirective } from './soft-disabled.directive';
import { SoftLoadingDirective } from './soft-loading.directive';
import { SoftLoadingBtnDirective } from './soft-loading-btn.directive';
import { userSoftAsyncUIConfigToken, userRegisteredSkeletonComponentsToken } from './user-config.token';
import { DefaultBusySpinnerComponent } from './default-busy-spinner/default-busy-spinner.component';
import { SoftSkelDirective } from './soft-skel.directive';
import { DefaultSkeletonComponent } from './skeletons/default-skeleton.component';
import { BarChartSkeletonComponent } from './skeletons/bar-chart-skeleton.component';
import { PieChartSkeletonComponent } from './skeletons/pie-chart-skeleton.component';
import { SummarySkeletonComponent } from './skeletons/summary-skeleton.component';
import { TableSkeletonComponent } from './skeletons/table-skeleton.component';

@NgModule({
    imports: [
      CommonModule,
    ],
    declarations: [
      SoftBusyDirective,
      SoftDisabledDirective,
      SoftLoadingDirective,
      SoftLoadingBtnDirective,
      DefaultBusySpinnerComponent,
      SoftSkelDirective,
      DefaultSkeletonComponent,
      BarChartSkeletonComponent,
      PieChartSkeletonComponent,
      SummarySkeletonComponent,
      TableSkeletonComponent,
    ],
    exports: [
      SoftBusyDirective,
      SoftDisabledDirective,
      SoftLoadingDirective,
      SoftLoadingBtnDirective,
      SoftSkelDirective,
    ]
})
export class SoftAsyncUIModule {
  static forRoot(
    config?: SoftAsyncUIConfig,
    registeredSkeletonComponents?: SoftSkeletonType,
  ): ModuleWithProviders<SoftAsyncUIModule> {
    return {
      ngModule: SoftAsyncUIModule,
      providers: [
        { provide: userSoftAsyncUIConfigToken, useValue: config },
        { provide: userRegisteredSkeletonComponentsToken, useValue: registeredSkeletonComponents },
      ],
    };
  }
}
