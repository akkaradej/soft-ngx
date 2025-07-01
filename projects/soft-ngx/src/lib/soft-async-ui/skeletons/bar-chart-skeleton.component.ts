import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'bar-chart-skeleton',
    template: `
    <div class="is-flex is-align-end is-justify-evenly">
      @for (barHeight of bars; track barHeight) {
        <div class="ph-item"
          >
          <div class="ph-picture" [style.height.px]="barHeight"></div>
        </div>
      }
    </div>
    `,
    styles: [`
    .ph-item {
      width: 7rem;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BarChartSkeletonComponent {

  bars;
  @Input() set context(context: { count: number }) {
    // random height
    this.bars = Array(context.count).fill(1).map(() => [40, 80, 120, 160][Math.floor(Math.random() * 4)]);
    // random heightest
    this.bars[Math.floor(Math.random() * context.count)] = 200;
  }
}
