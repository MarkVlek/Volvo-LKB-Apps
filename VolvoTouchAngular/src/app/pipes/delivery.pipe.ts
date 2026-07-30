import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'delivery'
})
export class DeliveryPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    let res = value.filter(x => x.medias.length > 0);

    if (res.length > 0) {
      return true;
    } else {
      return false;
    }
  }

}
