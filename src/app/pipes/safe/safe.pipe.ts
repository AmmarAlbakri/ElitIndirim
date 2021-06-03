import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  transform(url, unit: string): any {
    switch (unit) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      case '':
        return this.sanitizer.bypassSecurityTrustHtml(this.decodeEntities(url));
      default:
        return url;
    }
  }
  decodeEntities(encodedString) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
  }
}
