import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'table-skeleton',
    template: `
    <div class="ph-item">
      @for (i of numArray; track i) {
        <div
          class="ph-col-1"
          [class.is-hidden-mobile]="i > mobileNum">
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
      }
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
    standalone: false
})
export class TableSkeletonComponent {
  numArray = [1, 2, 3, 4, 5, 6, 7, 8];
  mobileNum = this.numArray.length;

  @Input() set context(context: { count: number, mobileCount: number }) {
    this.numArray = Array(context.count).fill(0).map((e, i) => i + 1);
    this.mobileNum = this.numArray.length;
    if (context.mobileCount) {
      this.mobileNum = context.mobileCount + 1;
    }
  }
}
