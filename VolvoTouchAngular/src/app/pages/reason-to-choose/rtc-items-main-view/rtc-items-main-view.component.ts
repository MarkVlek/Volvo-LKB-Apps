import { Component, OnInit } from '@angular/core';
import { RTCItem } from '../rtc-models/rtc-item.model';
import { ActivatedRoute } from '@angular/router';
import { RTCChooseItemService } from '../services/rtc-choose-item-service';

@Component({
  selector: 'app-rtc-items-main-view',
  templateUrl: './rtc-items-main-view.component.html',
  styleUrls: ['./rtc-items-main-view.component.scss']
})
export class RtcItemsMainViewComponent implements OnInit {
  items: RTCItem[];
  title: string;
  from: string;
  selectedItem: RTCItem = null;
  routerItem: string;
  page: string;
  showWarning: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public itemService: RTCChooseItemService) { }

  ngOnInit(): void {
    this.title = this.activatedRoute.snapshot.params["name"];
    this.page = this.activatedRoute.snapshot.params["page"];
    this.activatedRoute.data.subscribe(({ items }) => {
      this.items = items;
      this.routerItem = this.activatedRoute.snapshot.params['item'];
      this.selectedItem = this.items.find(i => i.name == this.routerItem) || this.items[0];
    });
  }

  changeItem(item: RTCItem) {
    this.selectedItem = item;

    this.showFinanceWarning(item)
  }


  isSelected(item: RTCItem) {
    return this.selectedItem === item;
  }

  showFinanceWarning(item: RTCItem) {
    switch(item.header1) {
      case "Volvo Billån":
      case "Volvo Inclusive Billån":
      case "Skaffa ett kort":
        this.showWarning = true;
        break;
      default: this.showWarning = false;
    }
  }

  filterItem(item: RTCItem): string {
    if (item.header1 == "CarPay") {
      return "CarPay";
    }

    if (item.has_loan_calculator) {
      return "Loan";
    }

    return "Normal";
  }
}
