import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'castingStatus'
})
export class CastingStatusPipe implements PipeTransform {

  transform(castingStatus: {key: string, value: string}[], orderId: string): unknown {
    if (!Array.isArray(castingStatus) || !orderId) return false;

    const match = castingStatus.find(item => {
      const [, id] = item.value.split(',');
      return id === orderId;
    });

    return match ? match.key : null;
  }

}
