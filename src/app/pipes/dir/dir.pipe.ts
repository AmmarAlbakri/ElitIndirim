import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dir',
  pure: false
})
export class DirPipe implements PipeTransform {
  constructor(private translate: TranslateService) { }
  transform(dir): any {
    if (this.translate.currentLang == 'ar') {
      return 'rtl';
    }
    return 'ltr';
  }

}
