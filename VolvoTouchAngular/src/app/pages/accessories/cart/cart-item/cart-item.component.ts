import { Component, Input, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { CartService } from 'src/app/services/cart.service';
import { StatisticService } from 'src/app/services/Statistics/statistics.service';
import { CartItem } from '../../cart-item-model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {
  @Input() cartItem: CartItem;
  @Input() index: number;

  img: string = "";
  mainText: string;
  amount: number = 0;

  constructor(private cartService: CartService,
    private statisticsService: StatisticService,
    private analyticService: AnalyticsService) { }

  ngOnInit(): void {
    
    this.img = this.cartItem.product.thumbnail;
    this.mainText = this.cartItem.product.title;
  }

  add() {
    this.analyticService.postEventToAnalytics(this.cartItem.product.title,'AddToCart',"EndlessAisle",1);
    this.cartItem.amount++;
  }

  remove() {
    if (this.cartItem.amount == 0) return;
    this.cartItem.amount--;
  }

  removeProduct(){
    this.cartService.RemoveProduct(this.index);
  }
}
