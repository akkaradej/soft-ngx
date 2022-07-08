import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer) {
  }

  transform(value: string, type: string): undefined | SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    if (!value) {
      return undefined;
    }
    switch (type) {
      case 'html':
        // trust html content e.g. [innerHTML]
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style':
        // trust css content e.g. [style.background-image]
        return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        // trust javascript content e.g. content with <script>...</script>
        return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        // trust a value that can be used in hyperlinks e.g. <img src>
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        // trust a location that may be used to load executable code from, e.g. <script src> <iframe src>
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        throw new Error(`Unable to bypass security for invalid type: ${type}`);
    }
  }
}
