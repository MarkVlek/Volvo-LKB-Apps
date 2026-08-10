import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { describeCar, VolvoLeveransklarabilar, VolvoLeveransklarabilarMedia } from '../models/LkbCategory';
import { AnalyticsService } from '../../../services/analytics.service';
import { SwiperComponent } from 'swiper/angular';

import SwiperCore, { Navigation, Pagination, SwiperOptions, Thumbs, Controller, } from 'swiper';
import { SwiperEvents } from 'swiper/types';

SwiperCore.use([Navigation, Pagination, Thumbs, Controller]);

@Component({
  selector: 'app-lkb-swiper-view',
  templateUrl: './lkb-swiper-view.component.html',
  styleUrls: ['./lkb-swiper-view.component.scss']
})
export class LkbSwiperViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() car: VolvoLeveransklarabilar;
  @ViewChild('main', { static: false }) mainSwiper?: SwiperComponent;
  @ViewChild('list', { static: false }) listSwiper?: SwiperComponent;

  /**
   * Which slides were actually reached. Seeded with the opening photo, which is shown rather than
   * chosen — so it neither reports nor counts as browsing.
   */
  private viewedSlides = new Set<number>([0]);

  constructor(private analytics: AnalyticsService) { }

  mainConfig: SwiperOptions = {
    slidesPerView: 1,
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
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: 15
  };

  slideList: string[] = ["1", "2", "3", "4", "5", "6", "7", "8"]
  mediaList: VolvoLeveransklarabilarMedia[] = []

  ngOnInit(): void {
    console.log(this.car.medias)
    if (this.car.medias.length == 0) {
      this.mediaList.push({
        SortOrder: 0,
        name: 'placeholder',
        url: './assets/images/AppSpecific/LeveransKlaraBilar/lkb-missing-img-new.jpg'
      });
    } else {
      this.car.medias.forEach(media => {
        if (media.name != null || media.name != undefined) {
          if (!media.name.includes('thumb'))
            this.mediaList.push(media);
        }
      })
    }
  }

  ngAfterViewInit(): void {
    this.listSwiper.showPagination = true
  }

  ngOnDestroy(): void {
    // Only report actual browsing: everyone "sees" the first image just by opening the car.
    if (this.viewedSlides.size > 1) {
      this.analytics.track(false, 'Gallery',
        `Browsed ${this.viewedSlides.size} of ${this.mediaList.length} images of ${describeCar(this.car)}`);
    }
  }

  next() {
    this.mainSwiper.swiperRef.slideNext(200, true)
  }

  prev() {
    this.mainSwiper.swiperRef.slidePrev(200, true)
  }

  onThumbnailClick(index: number) {
    this.mainSwiper.swiperRef.slideTo(index, 200)
  }

  onBeforeTransitionImage(eventParams: Parameters<SwiperEvents['beforeTransitionStart']>) {
    const [swiper] = eventParams;
    this.trackSlideView(swiper.activeIndex);

    if (swiper.previousIndex > swiper.activeIndex && (swiper.previousIndex) % 4 == 0) {
      this.listSwiper.swiperRef.slideTo(swiper.previousIndex - 4, 200)
    }
    else if ((swiper.activeIndex) % 4 == 0) {
      this.listSwiper.swiperRef.slideTo(swiper.activeIndex, 200)
    }

  }

  /**
   * Reports a photo the first time it is reached, whether by thumbnail, arrow or swipe. Repeats are
   * dropped, so paging back and forth over the same few photos cannot flood the event stream.
   */
  private trackSlideView(index: number) {
    if (this.viewedSlides.has(index)) return;
    this.viewedSlides.add(index);

    this.analytics.track(true, 'Gallery',
      `User viewed photo ${index + 1} of ${this.mediaList.length} of ${describeCar(this.car)}`);
  }

  handleMissingImage(media: VolvoLeveransklarabilarMedia) {
    this.analytics.track(false, 'Health', `Image failed to load for ${describeCar(this.car)}`);

    let index = this.mediaList.indexOf(media);
    this.mediaList.splice(index, 1)

  }
}
