import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { describeCar, VolvoLeveransklarabilar } from '../models/LkbCategory';
import { AnalyticsService } from '../../../services/analytics.service';

@Component({
  selector: 'app-lkb-finace-box',
  templateUrl: './lkb-finace-box.component.html',
  styleUrls: ['./lkb-finace-box.component.scss']
})
export class LkbFinaceBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() car: VolvoLeveransklarabilar;

  private subscriptions = new Subscription();

  constructor(private analytics: AnalyticsService) { }

  interestRate: number;
  currentCost: number;

  installment: number = 84;
  installment$: Subject<number> = new Subject<number>();

  startPrice: number;
  startPrice$: Subject<number> = new Subject<number>();

  ngOnInit(): void {
    this.installment$.subscribe(value => {
      this.installment = value;
      this.currentCost = this.calculateMonthlyPayment();
    });
    this.startPrice$.subscribe(value => {
      this.startPrice = value;
      this.currentCost = this.calculateMonthlyPayment();
    })

    // Separate debounced subscriptions so a slider drag reports once, on the value it settles on,
    // while the displayed cost above keeps updating live from the subscriptions in place already.
    this.subscriptions.add(this.startPrice$.pipe(debounceTime(600)).subscribe(() => {
      this.analytics.track(true, 'Finance',
        `User adjusted down payment to ${this.formatNumber(this.startPrice)} — ${this.formatNumber(this.currentCost)}/month for ${describeCar(this.car)}`);
    }));
    this.subscriptions.add(this.installment$.pipe(debounceTime(600)).subscribe(() => {
      this.analytics.track(true, 'Finance',
        `User adjusted period to ${this.installment} months — ${this.formatNumber(this.currentCost)}/month for ${describeCar(this.car)}`);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // The detail page fetches its vehicle asynchronously, so this can fire before the car input
      // is populated. The template already guards (*ngIf and car?.), so match that here.
      if (!this.car) return;

      this.interestRate = parseFloat(this.car.interestRate)
      const monInt = this.interestRate / 1200;
      const n = this.installment;
      const i = Math.pow(1 + monInt, n);
      this.startPrice = this.car.price * 0.2;
      const payment = (this.car.price - this.startPrice) * monInt * i / (i - 1) || 0;
      this.currentCost = Math.round(payment);
    }, 100)
  }

  startChashChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.startPrice$.next(value);
  }

  installmentChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.installment$.next(value);
  }

  calculateMonthlyPayment(): number {
    var p = this.car.price - this.startPrice;
    var annInt = this.interestRate;
    var monInt = annInt / 1200;
    var n = this.installment;
    var i = Math.pow((1 + monInt), n);
    var payment = (p * monInt * i) / (i - 1) || 0;
    return Math.round(payment);
  }

  formatNumber(num: number) {
    return new Intl.NumberFormat('fr-FR', { useGrouping: true }).format(num);
  }
}
