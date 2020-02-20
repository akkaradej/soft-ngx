import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer) {
  }

  transform(value: string, type: string): undefined | SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    if (!value) {
      return;
    }
    switch (type) {
      case 'html':
        // only use this when the bound HTML is unsafe (e.g. [innerHTML] contains <script> tags) and the code should be executed
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style':
        // safe style value (e.g. [style.background-image])
        return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        // safe JavaScript
        return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        // safe style URL, i.e. a value that can be used in hyperlinks or <img src>
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        // safe resource URL, i.e.a location that may be used to load executable code from, like <script src>, or <iframe src>
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        throw new Error(`Unable to bypass security for invalid type: ${type}`);
    }
  }
}
