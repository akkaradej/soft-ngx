import { Component, OnInit } from '@angular/core';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-demo-ui-state',
  templateUrl: './demo-ui-state.component.html',
  styleUrls: ['./demo-ui-state.component.scss']
})
export class DemoUIStateComponent implements OnInit {
  busy: any;
  loadingSub: any;

  constructor() { }

  ngOnInit() {
    this.busy = of().pipe(delay(Number.MAX_SAFE_INTEGER)).subscribe();
  }

  testLoading() {
    this.loadingSub = of().pipe(delay(3000)).subscribe();
  }

}
