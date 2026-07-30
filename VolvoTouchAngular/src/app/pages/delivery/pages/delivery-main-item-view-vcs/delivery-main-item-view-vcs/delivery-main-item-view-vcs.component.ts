import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { Accessories, Category } from '../../../models/agenda.model';
import { DeliveryAgendaService } from '../../../services/delivery-agenda.service';
import { ConfigService } from 'src/app/services/config.service';
import { SwiperEvents } from 'swiper/types';
import { DELIVERYIMAGESGLOBAL } from '../../../models/deliveryconst';
import { SwiperComponent } from 'swiper/angular';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { PageCard } from 'src/app/enums/page-card-enum';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-delivery-main-item-view-vcs',
  templateUrl: './delivery-main-item-view-vcs.component.html',
  styleUrls: ['./delivery-main-item-view-vcs.component.scss'],
  animations: [
    trigger('fadeState', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible => hidden', [animate('200ms ease-out')]),
      transition('hidden => visible', [animate('200ms ease-in')]),
    ]),
  ],
})

export class DeliveryMainItemViewVcsComponent {

  
  swiperSpeed = 700 

  mainConfig: SwiperOptions = {
    slidesPerView: 1,
    speed: this.swiperSpeed
  };

  thumbConfig: SwiperOptions = {
    pagination: {
      enabled: true,
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    slidesPerView: 10,
    slidesPerGroup: 4,
    spaceBetween: 40
  };

  @ViewChild('header', { static: false }) headerSwiper?: SwiperComponent;
  @ViewChild('main', { static: false }) mainSwiper?: SwiperComponent;
  @ViewChild('footer', { static: false }) footerSwiper?: SwiperComponent;

  @ViewChild('containerRef') containerElement!: ElementRef<HTMLDivElement>;

  slideList: string[] = ["1", "2", "3", "4", "5", "6", "7", "8"]
  
  categories: Category[] = []
  currCategory: string = "";

  lastPage: boolean = false;

  mainFeatures: Accessories[] = []
  footerFeatures: Accessories[] = []
  carModel: string = ""

  pathToMedia = DELIVERYIMAGESGLOBAL

  selectedIndex = 0
  title: string = ""
  currFeature: string = ""
  description: string = ""

  animationState = 'visible';
  fullscreenClicked: boolean = false;

  @ViewChildren('video') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;

  constructor(public deliveryAgendaService: DeliveryAgendaService, private configService: ConfigService,  private screenSaverTimerService: ScreenSaverTimerService, private router: Router, private cdr: ChangeDetectorRef) {
  
  }

  ngOnInit(): void {
    this.categories = this.deliveryAgendaService.agenda.categories.sort(
      (a, b) => b.name.length - a.name.length
    );

    this.carModel = this.deliveryAgendaService.agenda.carModel

    this.mainFeatures = this.categories.flatMap(x => x.accessories)
    this.footerFeatures = this.categories.flatMap(x => x.accessories)

    this.title = this.mainFeatures.at(0).name
    this.currFeature = this.mainFeatures.at(0).name
    this.description = this.mainFeatures.at(0).bodyText
  }

  ngAfterViewInit(): void {
    this.footerSwiper.showPagination = true
  }

  next() {
    this.mainSwiper.swiperRef.slideNext(this.swiperSpeed, true)
  }

  prev() {
    this.mainSwiper.swiperRef.slidePrev(this.swiperSpeed, true)
  }

  onBeforeTransitionImage(eventParams: Parameters<SwiperEvents['slideChange']>) {

    let pastVideo = <HTMLVideoElement>document.getElementById(this.currFeature);
    pastVideo.pause()

    const [swiper] = eventParams;

    this.toggleFeature(this.mainFeatures.at(swiper.activeIndex).name);

    this.selectedIndex = swiper.activeIndex
    this.currFeature = this.mainFeatures.at(this.selectedIndex).name
 
    this.animationState = 'hidden';

    let vid = <HTMLVideoElement>document.getElementById(this.currFeature);
    vid.play()

    setTimeout(() => { // Data is dependent on the title property. Make title and description separate params and 
      this.animationState = 'visible';
      this.title = this.mainFeatures.at(this.selectedIndex).name
      this.description = this.mainFeatures.at(this.selectedIndex).bodyText
      this.cdr.detectChanges();
    }, 200); // match fade-out duration

    this.cdr.detectChanges();

  }

  // When footer feature clicked
  toggleFeature(name: string) {
    
    let index = this.mainFeatures.findIndex(x => x.name == name)
  

    if(index >= 6 && this.selectedIndex < index) {
      this.lastPage = true
      const el = document.getElementById("featurelistscroller");
      if (el) {
        el.scrollLeft = 1000;
      }
    }
    else if (index <= this.mainFeatures.length - 7 && this.selectedIndex > index) {
      this.lastPage = false
      const el = document.getElementById("featurelistscroller");
      if (el) {
        el.scrollLeft = -1000;
      }
    } 

    this.selectedIndex = index;
    this.mainSwiper?.swiperRef.slideTo(this.selectedIndex, this.swiperSpeed);
}

  finish() {
    this.screenSaverTimerService.startTimer()
    this.router.navigate([PageCard.Delivery]);
  }

  back() {
    this.router.navigate([PageCard.DeliveryStart]);
  }


  onFullscreenClick() {
    this.fullscreenClicked = !this.fullscreenClicked

    if(this.fullscreenClicked) {
      const container = this.containerElement.nativeElement;
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } 
    }
    else {
      document.exitFullscreen();
    }
  }

}