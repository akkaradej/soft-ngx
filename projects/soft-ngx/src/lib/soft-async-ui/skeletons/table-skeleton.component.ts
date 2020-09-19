import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'table-skeleton',
  template: `
    <div class="ph-item">
      <div *ngFor="let i of [1,2,3,4,5,6,7,8]"
        class="ph-col-1">
        <div class="ph-row">
          <div class="ph-col-12 big"></div>
          <div class="ph-col-12"></div>
          <div class="ph-col-12"></div>
          <div class="ph-col-12"></div>
          <div class="ph-col-12"></div>
          <div class="ph-col-12"></div>
          <div class="ph-col-12"></div>
          <div class="ph-col-12"></div>
          <div class="ph-col-12"></div>
          <div class="ph-col-12"></div>
          <div class="ph-col-12"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ph-item {
      padding: 0 10px;
    }
    .ph-item > * {
      padding-right: 5px;
      padding-left: 5px;
    }
    .ph-row {
      margin-bottom: 0;
    }
    .ph-row div {
      height: 20px;
    }
    .ph-row .big, .ph-row.big div {
      height: 35px;
      margin-bottom: 10px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSkeletonComponent {

}
