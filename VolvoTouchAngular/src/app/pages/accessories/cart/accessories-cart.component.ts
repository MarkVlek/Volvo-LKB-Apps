import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PageCard } from 'src/app/enums/page-card-enum';
import { CartService } from 'src/app/services/cart.service';
import { StatisticService } from 'src/app/services/Statistics/statistics.service';
import { CartItem } from '../cart-item-model';

@Component({
  selector: 'accessories-cart',
  templateUrl: './accessories-cart.component.html',
  styleUrls: ['./accessories-cart.component.scss']
})
export class AccessoriesCartComponent implements OnInit, AfterViewInit {
  @ViewChild('name', { static: false }) name: ElementRef;
  @ViewChild('phone', { static: false }) phone: ElementRef;

  onName: boolean = false;
  onPhone: boolean = false;

  form: FormGroup;
  nameValue: string = "";
  phoneValue: string = "";


  constructor(
    public cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router,
    private statisticsService: StatisticService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
    });
  }

  ngAfterViewInit(): void {

  }

  onKeyClick(value: string) {
    if (this.onName) {
      if (value == "back" && this.nameValue != "") {
        this.nameValue = this.nameValue.slice(0, -1);
      }
      else if (value != "back") {
        if (value == "Space") {
          this.nameValue += " ";
        } else {
          this.nameValue += value;
        }
      }
      this.name.nativeElement.value = this.nameValue;
    }
    if (this.onPhone) {
      if (value == "back" && this.phoneValue != "") {
        this.phoneValue = this.phoneValue.slice(0, -1);
      }
      else if (value != "back") {
        if (value == "Space") {
          this.phoneValue += " ";
        } else {
          this.phoneValue += value;
        }
      }
      this.phone.nativeElement.value = this.phoneValue;
    }
  }

  setName() {
    this.onName = true;
    this.onPhone = false;
  }

  setPhone() {
    this.onPhone = true;
    this.onName = false;
  }


  sendOrder() {
    // TODO CHANGE THIS TO 1, THIS IS ONLY FOR 
    if (this.cartService.products.length < 1) {
      this.snackBar.open("Varukorgen är tom", "close", {
        duration: 2000
      });
      return;
    }
    if (this.nameValue.length < 1) {
      this.snackBar.open("Inget namn har angetts", "close", {
        duration: 2000
      });
      return;
    }
    if (this.phoneValue.length < 1) {
      this.snackBar.open("Inget namn har angetts", "close", {
        duration: 2000
      });
      return;
    }
    else {
      this.cartService.orderDoneProducts = this.cartService.products;
      this.cartService.products = [];
      this.cartService.name = this.nameValue;
      this.cartService.phone = this.phoneValue;
      
      this.router.navigate([PageCard.OrderDone])
    }
  }

  emptyCart() {
    this.cartService.products = [];
  }
}
