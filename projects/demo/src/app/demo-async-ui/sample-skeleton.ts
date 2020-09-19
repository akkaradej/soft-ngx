import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'sample-skeleton',
  template: `
    <div class="ph-item">
      <div class="ph-col-12">
        <div class="ph-row">
          <div class="ph-col-4"></div>
          <div class="ph-col-8 empty"></div>
          <div class="ph-col-6"></div>
          <div class="ph-col-6 empty"></div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleSkeletonComponent {

  @Input() set context(context: { count: number }) {
    // context.count
  }
}
