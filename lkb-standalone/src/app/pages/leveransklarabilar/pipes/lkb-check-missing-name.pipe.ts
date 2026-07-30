import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterMissingName'
})
export class LkbCheckMissingNamePipe implements PipeTransform {

  transform(categories: any[]): any[] {
    if (!categories) return [];
    return categories.filter(m => m.name !== null && m.name !== '');
  }

}
