import { Component, OnInit } from '@angular/core';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-busy-module',
  templateUrl: './busy-module.component.html',
  styleUrls: ['./busy-module.component.scss']
})
export class BusyModuleComponent implements OnInit {
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
