import { Component, Input } from '@angular/core';
import { SoftBusyComponent } from '../soft-busy.interface';

@Component({
  selector: 'soft-default-busy-spinner',
  templateUrl: './default-busy-spinner.component.html',
  styleUrls: ['./default-busy-spinner.component.css'],
})
export class DefaultBusySpinnerComponent implements SoftBusyComponent {
  @Input() data: any;
}
