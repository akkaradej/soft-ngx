import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'pie-chart-skeleton',
  template: `
    <div class="ph-item" [style.width.px]="size" [style.height.px]="size">
      <div class="ph-avatar"></div>
    </div>
 `,
  styles: [`
    .ph-item {
      margin: 0 auto;
    }
    .ph-avatar {
      margin-bottom: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartSkeletonComponent {

  size: number;
  @Input() set context(context: { size: number }) {
    this.size = context.size;
  }

}
