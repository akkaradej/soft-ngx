import { Component, OnInit } from '@angular/core';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-demo-async-ui',
  templateUrl: './demo-async-ui.component.html',
  styleUrls: ['./demo-async-ui.component.scss']
})
export class DemoAsyncUIComponent implements OnInit {
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
