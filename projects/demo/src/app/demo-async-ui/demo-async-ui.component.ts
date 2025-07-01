import { Component } from '@angular/core';

import { EMPTY, of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'app-demo-async-ui',
    templateUrl: './demo-async-ui.component.html',
    styleUrls: ['./demo-async-ui.component.scss'],
    standalone: false
})
export class DemoAsyncUIComponent {
  isShow = true;
  loadingTime = 5000;
  delay = 400;
  minHeight = 50;
  container = undefined;

  busy: Subscription;
  dataSub: Subscription;
  loadingSub: Subscription;

  constructor() { }

  // busy
  load() {
    this.busy = of({}).pipe(delay(this.loadingTime)).subscribe();
  }

  toggle() {
    if (this.isShow) {
      this.destroyContent();
    } else {
      this.isShow = true;
    }
  }

  destroyContent() {
    this.isShow = false;
    if (this.busy) {
      this.busy.unsubscribe();
    }
  }

  // skel
  getData() {
    this.dataSub = of({}).pipe(delay(300)).subscribe();
  }

  // loading/disabled
  testLoading() {
    this.loadingSub = of({}).pipe(delay(3000)).subscribe();
  }

}
