import { Component, Input, OnInit } from '@angular/core';
import { LkbService } from 'src/app/services/lkb.service';
import { VolvoLeveransklarabilar } from '../models/LkbCategory';

@Component({
  selector: 'app-lkb-car-card',
  templateUrl: './lkb-car-card.component.html',
  styleUrls: ['./lkb-car-card.component.scss']
})
export class LkbCarCardComponent implements OnInit {
  @Input() car: VolvoLeveransklarabilar;
  branch: any;
  carLocationsCount: any;
  bgStyle: string;
  price: string;
  thumbnail: string = null;

  constructor(private lkbService: LkbService) { }

  ngOnInit(): void {
    this.branch = this.lkbService.getCurrentBranch();
    this.carLocationsCount = this.lkbService.carLocationsCount;
    this.bgStyle = "background"
    this.thumbnail = this.getThumbNail()
    this.formatPrice()
  }

  setBgImage(car: VolvoLeveransklarabilar) {
    let url: string;
    if (car.medias !== undefined && car.medias.length > 0) {
      url = car.medias.sort((a, b) => a.SortOrder - b.SortOrder)[0].url;
    }
    else {
      url = 'assets/images/AppSpecific/LeveransKlaraBilar/lkb-missing-img-new.jpg';
    }
    document.getElementById("img-container").style.backgroundImage = "url(" + url + ")";
  }

  getImage(car: VolvoLeveransklarabilar): string {
    if (car.medias !== undefined && car.medias.length > 0) {
      return car.medias.sort((a, b) => a.SortOrder - b.SortOrder)[0].url;
    }
    return 'assets/images/AppSpecific/LeveransKlaraBilar/lkb-missing-img.png';
  }

  errorImg(elem){
    (elem.target as HTMLImageElement).src = 'assets/images/AppSpecific/LeveransKlaraBilar/lkb-missing-img-new.jpg'
  }

  formatPrice() {
    const formatter = new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      minimumFractionDigits: 0,
      currency: 'SEK'
    });

    this.price = formatter.format(this.car.price);
  }

  getThumbNail() {
    var thumbnail
    for (var media of this.car.medias) {
      if (media.name.includes('thumb'))
        thumbnail = media.url
    }
    return thumbnail
  }
}
