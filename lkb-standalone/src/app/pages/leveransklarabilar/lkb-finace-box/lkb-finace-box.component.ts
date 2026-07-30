import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { VolvoLeveransklarabilar } from '../models/LkbCategory';

@Component({
  selector: 'app-lkb-finace-box',
  templateUrl: './lkb-finace-box.component.html',
  styleUrls: ['./lkb-finace-box.component.scss']
})
export class LkbFinaceBoxComponent implements OnInit, AfterViewInit {
  @Input() car: VolvoLeveransklarabilar;

  constructor() { }

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
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
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
