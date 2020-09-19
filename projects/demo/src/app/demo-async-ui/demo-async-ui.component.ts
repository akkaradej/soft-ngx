import { Component } from '@angular/core';

import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-demo-async-ui',
  templateUrl: './demo-async-ui.component.html',
  styleUrls: ['./demo-async-ui.component.scss']
})
export class DemoAsyncUIComponent {
  isShow = true;
  loadingTime = 5000;
  delay = 400;
  minHeight = 50;
  container = undefined;

  busy: Subscription;
  loadingSub: Subscription;

  constructor() { }

  load() {
    this.busy = of().pipe(delay(this.loadingTime)).subscribe();
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

  testLoading() {
    this.loadingSub = of().pipe(delay(3000)).subscribe();
  }

}
