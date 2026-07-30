import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateAtFirstPeriod'
})
export class TruncateAtFirstPeriodPipe implements PipeTransform {
  transform(value: string, minLength: number = 200): string {
    if (!value || value.length <= minLength) {
      return value;
    }

    const firstPeriodAfterCutoff = value.indexOf('.', minLength);
    if (firstPeriodAfterCutoff !== -1) {
      return value.slice(0, firstPeriodAfterCutoff + 1).trim();
    }

    return value; // no period found, return full string
  }
}
