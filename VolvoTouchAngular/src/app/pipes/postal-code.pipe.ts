import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Postalcode'
})
export class PostalcodePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length !== 5) return value;
    return digitsOnly.slice(0, 3) + ' ' + digitsOnly.slice(3);
  }
}