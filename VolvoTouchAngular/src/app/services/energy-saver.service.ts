import { Injectable, OnDestroy } from '@angular/core';
import { timer, Subscription, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EnergySaverService implements OnDestroy {
  private isActiveSubject = new BehaviorSubject<boolean>(false);
  public isActive$ = this.isActiveSubject.asObservable();
  private startSubscription?: Subscription;
  private stopSubscription?: Subscription;

  constructor() {
    this.energySaverTimer(22, 0, 6, 0);
  }

  ngOnDestroy(): void {
    this.startSubscription?.unsubscribe();
    this.stopSubscription?.unsubscribe();
  }

  get isActive(): boolean {
    return this.isActiveSubject.value;
  }

  private setActive(value: boolean): void {
    this.isActiveSubject.next(value);
  }
 
  energySaverTimer(startHour: number, startMinute: number, stopHour: number, stopMinute: number): void {
    const now = new Date();
    const start = new Date();
    const stop = new Date();

    start.setHours(startHour, startMinute, 0, 0);
    stop.setHours(stopHour, stopMinute, 0, 0);

    const isOvernightRange = stopHour < startHour || (stopHour === startHour && stopMinute < startMinute);
    
    if (isOvernightRange) {
      if (now < stop) {
        start.setDate(start.getDate() - 1);
        this.setActive(true);
      } else if (now >= start) {
        stop.setDate(stop.getDate() + 1);
        this.setActive(true);
      } else {
        stop.setDate(stop.getDate() + 1);
        this.setActive(false);
      }
    } else {
      this.setActive(now >= start && now < stop);
      
      if (now >= stop) {
        start.setDate(start.getDate() + 1);
        stop.setDate(stop.getDate() + 1);
      }
    }

    const timeUntilStart = start.getTime() - now.getTime();
    const timeUntilStop = stop.getTime() - now.getTime();

    if (timeUntilStart > 0) {
      this.startSubscription?.unsubscribe();
      this.startSubscription = timer(timeUntilStart).subscribe(() => {
        this.setActive(true);
        this.energySaverTimer(startHour, startMinute, stopHour, stopMinute);
      });
    }

    if (timeUntilStop > 0) {
      this.stopSubscription?.unsubscribe();
      this.stopSubscription = timer(timeUntilStop).subscribe(() => {
        this.setActive(false);
      });
    }
  }
}