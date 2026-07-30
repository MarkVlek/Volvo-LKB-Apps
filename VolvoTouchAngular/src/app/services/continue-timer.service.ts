import { Injectable } from "@angular/core";
import { Observable, Subject, Subscription, timer } from "rxjs";
import { CONTINUEMODAL_TIME } from "../constants";

@Injectable()
export class ContinueTimerService {
    time: number = 0;
    maxTime: number = 10 * CONTINUEMODAL_TIME;
    observer$: Observable<any>;
    subscription$: Subscription;
    /**
     * Sends out an event when the timer is complete
     */
    onComplete: Subject<void> = new Subject<void>();

    constructor() {
        this.observer$ = timer(0, 100);
    }

    resetTimer() {
        this.time = 0;
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