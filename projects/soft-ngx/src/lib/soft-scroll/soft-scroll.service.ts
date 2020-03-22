import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoftScrollService {

  /*
   * @param scrollingView - a scrollable container e.g. div with "overflow: scroll" style, default is root document
   */
  scrollTo(target: HTMLElement, scrollingView: HTMLElement = document.documentElement, offset = 0, duration = 600): Promise<any> {
    return new Promise(resolve => {
      if (!target) {
        resolve();
        return;
      }

      const start = scrollingView.scrollTop;
      // let to;
      // if (scrollingView === document.documentElement) {
      //   to = target.getBoundingClientRect().top + start + offset;
      // } else {
      //   if (scrollingView.offsetParent) {
      //     let element = target;
      //     let offsetTop = element.offsetTop;
      //     while (element.offsetParent !== scrollingView.offsetParent) {
      //       element = element.offsetParent as HTMLElement;
      //       offsetTop += element.offsetTop;
      //     }
      //     to = offsetTop - scrollingView.offsetTop + offset;
      //   } else {
      //     to = target.offsetTop - scrollingView.offsetTop + offset;
      //   }
      // }

      let element = target;
      let offsetTop = element.offsetTop;
      while (element.offsetParent !== scrollingView.offsetParent) {
        element = element.offsetParent as HTMLElement;
        offsetTop += element.offsetTop;
      }
      const to = offsetTop - scrollingView.offsetTop + offset;

      const scrollDistance = to - start;
      const startDate = +new Date();
      this.animateScroll(scrollingView, startDate, start, to, scrollDistance, duration, resolve);
    });
  }

  private animateScroll(scrollingView, startDate, start, to, scrollDistance, duration, resolve) {
    const currentDate = +new Date();
    const currentTime = currentDate - startDate;
    scrollingView.scrollTop = this.easeInOutQuad(currentTime, start, scrollDistance, duration);
    if (currentTime < duration) {
      requestAnimationFrame(() => this.animateScroll(scrollingView, startDate, start, to, scrollDistance, duration, resolve));
    } else {
      scrollingView.scrollTop = to;
      resolve();
    }
  }

  // t = current time
  // b = start value
  // c = change in value
  // d = duration
  private easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) { return c / 2 * t * t + b; }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
}
