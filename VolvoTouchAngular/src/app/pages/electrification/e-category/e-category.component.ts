import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RTCItem } from '../../reason-to-choose/rtc-models/rtc-item.model';
import { ElectrificationService } from 'src/app/services/electrification.service';

@Component({
  selector: 'app-e-category',
  templateUrl: './e-category.component.html',
  styleUrls: ['./e-category.component.scss']
})
export class ECategoryComponent implements OnInit {
  items: RTCItem[];
  title: string;
  from: string;
  selectedItem: RTCItem = null;
  routerItem: string;

  constructor(
    private activatedRoute: ActivatedRoute, private electrificationService: ElectrificationService) { }

  ngOnInit(): void {
    this.routerItem = this.activatedRoute.snapshot.params['name'];

    console.log('Router name is: ' + this.routerItem)

    this.items = this.electrificationService.catagories.items;


    console.log('Fetching category items from electrification service')
    this.items.forEach(x => {
      console.log(x.name)
    })

    this.selectedItem = this.items.find(i => i.name == this.routerItem) || this.items[0];
    this.title = "Laddskola";
  }

  changeItem(item: RTCItem) {
    this.selectedItem = item;
  }

  isSelected(item: RTCItem) {
    return this.selectedItem === item;
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
