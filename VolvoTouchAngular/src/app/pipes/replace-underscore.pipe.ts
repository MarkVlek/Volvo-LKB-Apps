import { Pipe,PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeUnderscore'
})
export class RemoveUnderScorePipe implements PipeTransform{
    transform(value: string) {
        var token = "_";
        var newToken = " ";
        var oldStr = value;
        var newStr = oldStr.split(token).join(newToken);
        return newStr;
    }
}