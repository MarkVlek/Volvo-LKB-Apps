import { Injectable } from "@angular/core";
import { Observable, Subject, Subscription, timer } from "rxjs";
import { SCREENSAVER_TIME } from "../constants";

@Injectable()
export class ScreenSaverTimerService {
    time: number = 0;
    maxTime: number = SCREENSAVER_TIME;
    observer$: Observable<any>;
    subscription$: Subscription;
    onComplete: Subject<void> = new Subject<void>();

    constructor() {
        this.observer$ = timer(0, 1000);
    }

    resetTimer() {
        this.time = 0;
    }

    startTimer(first: boolean = false) {
        if (first) this.time = 115;
        else this.time = 0;
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

    stopTimer(){
        this.subscription$.unsubscribe();
        this.resetTimer();
    }
}