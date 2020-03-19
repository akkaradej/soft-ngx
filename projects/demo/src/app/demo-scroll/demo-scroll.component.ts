import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SoftScrollService } from 'soft-ngx';

@Component({
  selector: 'app-demo-scroll',
  templateUrl: './demo-scroll.component.html',
  styleUrls: ['./demo-scroll.component.scss']
})
export class DemoScrollComponent implements OnInit {

  @ViewChild('buttonA') buttonA: ElementRef<HTMLElement>;
  @ViewChild('buttonB') buttonB: ElementRef<HTMLElement>;
  @ViewChild('input') input: ElementRef<HTMLElement>;
  @ViewChild('overflowContainer') overflowContainer: ElementRef<HTMLElement>;

  constructor(
    private scrollService: SoftScrollService
  ) { }

  ngOnInit() {
  }

  goToA() {
    this.scrollService.scrollTo(this.buttonA.nativeElement);
  }

  goToB() {
    this.scrollService.scrollTo(this.buttonB.nativeElement);
  }

  goToInput() {
    this.scrollService.scrollTo(this.input.nativeElement, this.overflowContainer.nativeElement);
  }

  save(form) {
    if (form.invalid) {
      return;
    }
    // do after form valid
  }
}
