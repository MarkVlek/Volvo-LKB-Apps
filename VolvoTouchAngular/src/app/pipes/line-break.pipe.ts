import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'replaceLineBreaks' })
export class ReplaceLineBreaks implements PipeTransform {
    transform(value: string): string {
        var token = "<br>";
        var newToken = "\n";
        var oldStr = value;
        var newStr = oldStr.split(token).join(newToken);
        return newStr;
    }
}
