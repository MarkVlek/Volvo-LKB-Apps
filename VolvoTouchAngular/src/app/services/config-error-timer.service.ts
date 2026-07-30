import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';

@Injectable()
export class ConfigErrorService {
    time: number = 0;
    maxTime: number = 60;
    observer$: Observable<any>;
    subscription$: Subscription;
    onComplete: Subject<void> = new Subject<void>();

    constructor() {
        this.observer$ = timer(0, 1000);
    }

    startTimer() {
        this.time = 0;
        this.subscription$ = this.observer$.subscribe(() => {
            this.time++;
            if (this.checkIfComplete(this.time, this.maxTime)) {
                this.onComplete.next();
                this.subscription$.unsubscribe();
            }
        })
    }

    checkIfComplete(current: number, max: number): boolean {
        if (current >= max) return true;
        return false;
    }
}
