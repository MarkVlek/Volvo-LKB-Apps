import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'includeKRPipe' })
export class IncludeKRPipe implements PipeTransform {
    transform(value: string): string {
        if(value.toLowerCase().includes("kr"))
        {
            return value;
        }
        return value + " kr";
    }
}
