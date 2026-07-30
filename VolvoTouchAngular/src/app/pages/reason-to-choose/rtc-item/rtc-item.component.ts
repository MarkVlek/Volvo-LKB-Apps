import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { RTCItem } from '../rtc-models/rtc-item.model';

@Component({
  selector: 'app-rtc-item',
  templateUrl: './rtc-item.component.html',
  styleUrls: ['./rtc-item.component.scss']
})
export class RTCItemComponent implements OnInit {
  @Input() item: RTCItem;
  page: string;
  name: string;
  product: string;
  size: string;


  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) { 
     
    }

  ngOnInit(): void {
    let url = this.activatedRoute.snapshot.url.join().split(',')

    if (url[2] == "Laddskola") {
      this.size = "height: 350px; width: 350px; "
    }
    else {
      this.size = "height: 420px; width: 350px;"
    }
    if (decodeURIComponent(url[1]) == "Privat" || decodeURIComponent(url[1]) == "Företag") {
      this.size = "height: 325px; width: 450px;"
    }
    this.page = decodeURIComponent(url[1]);
    this.name = decodeURIComponent(url[2]);
  }

  pageIsRtc(input: PageCard): boolean {
    if (input == PageCard.Tjänster || input == PageCard.Innovationer) {
      return true;
    }
    return false;
  }

  onClick() {
    if (
      this.page != PageCard.Innovationer &&
      this.page != PageCard.Tjänster &&
      this.name == "Volvokort/CarPay") {

      this.router.navigate([PageCard.RTCItemView + "/" + this.page + "/" + "VolvokortCarPay" + "/" + this.item.name]);
    }
    else {
      this.router.navigate([PageCard.RTCItemView, this.page, this.name, this.item.name]);
    }
  }

  hasVideo(item: RTCItem): boolean {
    if (!!item.video && item.video.includes('.mp4')) {
      return true;
    }
    return false;
  }
}
