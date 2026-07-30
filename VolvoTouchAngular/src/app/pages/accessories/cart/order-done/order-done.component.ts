import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { CartService } from 'src/app/services/cart.service';
import { StatisticService } from 'src/app/services/Statistics/statistics.service';

@Component({
  selector: 'app-order-done',
  templateUrl: './order-done.component.html',
  styleUrls: ['./order-done.component.scss']
})
export class OrderDoneComponent implements OnInit {

  constructor(public cartService: CartService,
    private statisticsService: StatisticService,
    private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.analyticsService.postEventToAnalytics("Order sent","Put Order","EndlessAisle",1);

    this.cartService.sendEmail(
      this.cartService.orderDoneProducts,
      this.cartService.name,
      this.cartService.phone);
  }
}
