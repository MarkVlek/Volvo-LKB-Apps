import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSeparator'
})
export class ThousandSeparatorPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (typeof value !== 'number') {
      return value;
    }

    // Convert the number to string and replace every sequence of 3 digits 
    // (from the end) with the same digits separated by a space.
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
}
