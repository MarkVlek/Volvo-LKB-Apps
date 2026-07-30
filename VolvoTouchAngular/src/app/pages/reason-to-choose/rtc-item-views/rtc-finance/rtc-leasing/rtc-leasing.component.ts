import { AfterContentInit, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-rtc-leasing',
  templateUrl: './rtc-leasing.component.html',
  styleUrls: ['./rtc-leasing.component.scss']
})
export class RtcLeasingComponent implements AfterContentInit {
  // Observables for car price, number of months, and initial cash
  carPrice$: BehaviorSubject<number>;
  months$: Subject<number>;
  startCash$: BehaviorSubject<number>;

  // Variables for the current car price, number of months, initial cash, and output
  carPrice: number;
  months: number;
  startCash: number;
  output: number;

  constructor() {
    // Initialize values
    this.carPrice = 200000;
    this.months = 42;
    this.startCash = 50000;
    this.output = 10;

    // Initialize observables
    this.carPrice$ = new BehaviorSubject<number>(this.carPrice);
    this.months$ = new Subject<number>();
    this.startCash$ = new BehaviorSubject<number>(this.startCash);
  }

  ngAfterContentInit(): void {
    // Subscribe to car price changes
    this.carPrice$.subscribe(price => {
      // Adjust startCash if it is higher than the new car price
      if (price < this.startCash) {
        this.startCash = price;
      }
      this.startCash$.next(this.startCash);

      // Recalculate output
      this.calcOutput(price, this.months, this.startCash);
    });

    // Subscribe to startCash changes
    this.startCash$.subscribe(c => {
      // Prevent startCash from exceeding the current car price
      if (this.startCash > c) {
        this.startCash = c;
      }

      // Recalculate output
      this.calcOutput(this.carPrice, this.months, this.startCash);
    });

    // Subscribe to number of months changes
    this.months$.subscribe(() => {
      // Recalculate output whenever the number of months changes
      this.calcOutput(this.carPrice, this.months, this.startCash);
    });
  }

  listenToPriceChange(newPrice: number) {
    // Adjust startCash if the new car price is lower
    if (newPrice < this.startCash) {
      this.startCash = newPrice;
    }

    // Update the car price
    this.carPrice = newPrice;
    this.carPrice$.next(newPrice);
  }

  listenToNumOfMonthChange(event: number) {
    // Update the number of months
    this.months = event;
    this.months$.next(event);
  }

  listenToStartCashChange(event: number) {
    // Update startCash
    this.startCash = event;
    this.startCash$.next(event);
  }

  calcOutput(carPrice: number, months: number, startCash: number) {
    // Calculate the monthly payment based on the given parameters and a constant annual interest rate
    let principal = carPrice - startCash;
    let annualInterest = 7.95;
    let monthlyInterest = annualInterest / 1200;
    let numPayments = months;
    let interestFactor = Math.pow((1 + monthlyInterest), numPayments);
    let payment = (principal * monthlyInterest * interestFactor) / (interestFactor - 1) || 0;

    // Make sure the payment is not negative
    payment = payment < 0 ? 0 : payment;

    // If the number of months is 0, set the output to the total car price minus the initial cash
    // Otherwise, round the calculated payment to the nearest whole number
    this.output = months === 0 ? carPrice - startCash : Math.round(payment);
  }
}
