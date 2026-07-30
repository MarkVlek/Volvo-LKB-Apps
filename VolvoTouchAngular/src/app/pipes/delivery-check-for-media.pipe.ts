import { Pipe, PipeTransform } from '@angular/core';
import { Accessories } from '../pages/delivery/models/agenda.model';

@Pipe({
  name: 'deliveryCheckForMedia'
})
export class DeliveryCheckForMediaPipe implements PipeTransform {

  transform(value: Accessories[], ...args: unknown[]): boolean {
    if (value) {
      let hasMedia = false;
      value.forEach(accessorie => {
        if (accessorie.medias?.length > 0) {
          hasMedia = true;
        }
      });
      return hasMedia;
    } else {
      return false;
    }

  }

}
