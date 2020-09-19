import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'summary-skeleton',
  template: `
    <div class="ph-item">
      <div class="ph-col-12">
        <div class="ph-row">
          <div class="ph-col-12 _total"></div>
        </div>
      </div>
      <div *ngFor="let i of [1,2,3,4,5]"
        class="ph-col-2">
        <div class="ph-row">
          <div class="ph-col-12 _status"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ph-item {
      padding: 0 10px;
    }
    .ph-item > * {
      padding-right: 12px;
      padding-left: 12px;
    }
    .ph-row {
      margin-bottom: 0;
    }
     .ph-row ._total {
      height: 40px;
      margin-bottom: 24px;
      border-radius: 8px;
    }
    .ph-row ._status {
      height: 80px;
      width: 224px;
      border-radius: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummarySkeletonComponent {

}
