import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from '../../cart-item-model';

@Component({
  selector: 'app-order-done-item',
  templateUrl: './order-done-item.component.html',
  styleUrls: ['./order-done-item.component.scss']
})
export class OrderDoneItemComponent implements OnInit {
  @Input() cartItem: CartItem;

  constructor() { 
  }

  ngOnInit(): void {
  }

}
