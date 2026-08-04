import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { HarmonyConfigService } from '../../../services/harmony-config.service';
import { LkbService } from '../../../services/lkb.service';
import SwiperCore, { Navigation, Pagination, SwiperOptions, Thumbs, Controller, } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { SwiperEvents } from 'swiper/types';
import { VolvoLeveransklarabilar } from '../models/LkbCategory';

SwiperCore.use([Navigation, Pagination, Thumbs, Controller]);

@Component({
  selector: 'app-lkb-details',
  templateUrl: './lkb-details.component.html',
  styleUrls: ['./lkb-details.component.scss']
})
export class LkbDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer', { static: false }) drawer?: MatDrawer;
  @ViewChild('swiperImage', { static: false }) swiperImage?: SwiperComponent;
  @ViewChild('swiperThumbnail', { static: false }) swiperThumbnail?: SwiperComponent;
  show: boolean = false;

  constructor(
    public lkbService: LkbService,
    public harmonyConfig: HarmonyConfigService,
    // public navigationService: any
  ) { }
  shaded: boolean = false;
  currentPaymentPlan: number;

  isUsedCar: boolean;
  carPrice: number;
  minCash: number = 0;
  maxCash: number = 0;
  cashChosen: number = 0;
  minMonth: number = 12;
  maxMonth: number = 84;
  monthChosen: number = 0;
  INTEREST: number = 4.95;

  imageConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 0,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };

  thumbnailConfig: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 15,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };

  car: VolvoLeveransklarabilar;
  dealerId: string;
  options: string[]
  dealerLocation: string;
  drivingWheel: string;
  price: string;
  fuelIcon: string;


  ngAfterViewInit(): void {
    this.drawer.closedStart.subscribe(() => {
      this.lkbService.showInsurance = false;
    })
  }

  ngOnInit(): void {
    this.shaded = false;
    this.dealerId = this.harmonyConfig.dealerId;
    // this.navigationService.backClicked.subscribe(() => { this.shaded = true; })

    // this.lkbService.getCar(this.lkbService.selectedCar.regNr).subscribe(res => {
    this.lkbService.getCar(this.lkbService.selectedCar.id).subscribe(res => {
      //Only get options here. Or maybe get options with every car? Put this in resolver instead?
      this.car = res;
      this.show = true;
      this.options = res.optionsCommaSeparated;
      this.getLocation(res);
      this.getDrivingWheel(res);
      this.formatPrice(res);
      this.getFuelIcon(res);
    });

    this.lkbService.toggleDrawer$.subscribe(() => {
      this.lkbService.showInsurance = false;
      this.drawer.toggle();
    })
  }

  onBeforeTransitionImage(eventParams: Parameters<SwiperEvents['beforeTransitionStart']>) {
    const [swiper] = eventParams;

    if (swiper.previousIndex > swiper.activeIndex && (swiper.previousIndex) % 4 == 0) {
      this.swiperThumbnail.swiperRef.slideTo(swiper.previousIndex - 4)
    }
    else if ((swiper.activeIndex) % 4 == 0) {
      this.swiperThumbnail.swiperRef.slideTo(swiper.activeIndex)
    }

  }

  onThumbnailClick(index: number) {
    this.swiperImage.swiperRef.slideTo(index)
  }

  onNavigationClick(forwardDirection: boolean) {
    if (forwardDirection) {
      this.swiperImage.swiperRef.slideTo(this.swiperImage.swiperRef.activeIndex + 1)
    }
    else {
      this.swiperImage.swiperRef.slideTo(this.swiperImage.swiperRef.activeIndex - 1)
    }
  }

  getLocation(car: VolvoLeveransklarabilar) {
    this.dealerLocation = car.branch.toLowerCase() + " " + car.location;
  }

  getDrivingWheel(car: VolvoLeveransklarabilar) {
    switch (car.drivingWheel) {
      case "Fyrhjulsdrift":
        this.drivingWheel = "AWD"
        break;
      case "Framhjulsdrift":
        this.drivingWheel = "FWD"
        break;
      case "Bakhjulsdrift":
        this.drivingWheel = "RWD"
        break;
      default:
        this.drivingWheel = "";
        break;
    }

  }

  getFuelIcon(car: VolvoLeveransklarabilar) {
    switch (car.fuel) {
      case "Diesel":
        this.fuelIcon = "https://www.volvocars.com/static/shared/icons/v2/car-fuel-40.svg"
        break;
      case "Bensin":
        this.fuelIcon = "https://www.volvocars.com/static/shared/icons/v2/car-fuel-40.svg"
        break;
      case "Laddhybrid":
        this.fuelIcon = "https://www.volvocars.com/static/shared/icons/v2/car-hybrid-40.svg"
        break;
      case "Bensin+El":
        this.fuelIcon = "https://www.volvocars.com/static/shared/icons/v2/car-hybrid-40.svg"
        break;
      case "El":
        this.fuelIcon = "https://www.volvocars.com/static/shared/icons/v2/car-electric-40.svg"
        break;
      default:
        this.fuelIcon = "https://www.volvocars.com/static/shared/icons/v2/car-fuel-40.svg"
        break;
    }
  }

  formatPrice(car: VolvoLeveransklarabilar) {
    const formatter = new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      minimumFractionDigits: 0,
      currency: 'SEK'
    });

    this.price = formatter.format(car.price);
  }

  toggleInsurance() {
    this.drawer.open();
  }

  formatDealerName(name: string) {
    if (name != null) {
      if (name.includes('(')) {
        return name.split('(')[0]
      }
      if (name.includes('Volvo Car') || name.includes('Volvo Studio Stockholm')) {
        return name;
      }
      else if (name.toLowerCase().includes('volvo')) {
        return name.toLowerCase().replace('volvo', '')
      }
      else return name;
    } else return '';
  }
}
