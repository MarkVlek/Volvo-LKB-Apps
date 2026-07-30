import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { VolvoLeveransklarabilar, VolvoLeveransklarabilarMedia } from '../models/LkbCategory';
import { SwiperComponent } from 'swiper/angular';

import SwiperCore, { Navigation, Pagination, SwiperOptions, Thumbs, Controller, } from 'swiper';
import { SwiperEvents } from 'swiper/types';

SwiperCore.use([Navigation, Pagination, Thumbs, Controller]);

@Component({
  selector: 'app-lkb-swiper-view',
  templateUrl: './lkb-swiper-view.component.html',
  styleUrls: ['./lkb-swiper-view.component.scss']
})
export class LkbSwiperViewComponent implements OnInit, AfterViewInit {
  @Input() car: VolvoLeveransklarabilar;
  @ViewChild('main', { static: false }) mainSwiper?: SwiperComponent;
  @ViewChild('list', { static: false }) listSwiper?: SwiperComponent;

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

    if (swiper.previousIndex > swiper.activeIndex && (swiper.previousIndex) % 4 == 0) {
      this.listSwiper.swiperRef.slideTo(swiper.previousIndex - 4, 200)
    }
    else if ((swiper.activeIndex) % 4 == 0) {
      this.listSwiper.swiperRef.slideTo(swiper.activeIndex, 200)
    }

  }

  handleMissingImage(media: VolvoLeveransklarabilarMedia) {

    let index = this.mediaList.indexOf(media);
    this.mediaList.splice(index, 1)

  }
}
