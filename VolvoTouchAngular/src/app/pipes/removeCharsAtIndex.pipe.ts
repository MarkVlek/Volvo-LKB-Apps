import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'removeChars' })
export class RemoveCharsPipe implements PipeTransform {
    transform(value: string, limit: number): string {
        if (!value || typeof value !== 'string') {
            return value;
        }
        if (value.length > limit) {
            return `${value.substring(0, limit - 3)}...`;
        } else {
            return value;
        }
    }
}
