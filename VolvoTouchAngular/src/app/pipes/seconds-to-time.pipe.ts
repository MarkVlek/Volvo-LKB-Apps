import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'secondsToTime'
})
export class SecondsToTimePipe implements PipeTransform {
    transform(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
    }

    private pad(num: number): string {
        return num.toString().padStart(2, '0');
    }
}
