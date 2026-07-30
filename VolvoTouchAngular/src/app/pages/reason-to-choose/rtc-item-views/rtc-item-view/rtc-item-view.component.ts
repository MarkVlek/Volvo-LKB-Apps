import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren, } from '@angular/core';
import { RTCItem } from '../../rtc-models/rtc-item.model';
import { RTCChooseItemService } from '../../services/rtc-choose-item-service';
import { RTCSingleViewService } from '../../services/rtc-single-view.service';
import { SpotlightMedia } from '../../interfaces/SpotLightMedia.interface';
import { RTCImage } from '../../rtc-models/rtc-image.model';
import { FullscreenModalComponent } from 'src/app/modals/fullscreen-modal/fullscreen-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import SwiperCore, { Navigation, EffectFade, EffectCoverflow, EffectCube, EffectCards, EffectCreative, EffectFlip, SwiperOptions } from "swiper";
import { SwiperComponent } from 'swiper/angular';
import { Subscription } from 'rxjs';

SwiperCore.use([Navigation, EffectFade, EffectCoverflow, EffectCube, EffectCards, EffectCreative, EffectFlip]);

@Component({
  selector: 'app-rtc-item-view',
  templateUrl: './rtc-item-view.component.html',
  styleUrls: ['./rtc-item-view.component.scss']
})
export class RtcItemViewComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('main', { static: false }) mainSwiper?: SwiperComponent;
  @ViewChildren('videos') videos: QueryList<ElementRef>;

  @Input() item: RTCItem;
  showFullscreen: boolean = true;
  onVideo: boolean = false;
  spotlightMedia: SpotlightMedia;
  infoText: string;
  bulletPoints: string[];
  mediaList: RTCImage[];
  video: string;
  mHeight: string = "0";
  sHeight: string = "0";
  sImage: string = "";
  sVideo: string = "";
  currentIndex: number;
  private activeIndexChangeSubscription: Subscription;

  mainConfig: SwiperOptions = {
    slidesPerView: 1,
  };

  constructor(
    public itemService: RTCChooseItemService,
    public singelItemService: RTCSingleViewService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute) { }

  onSlideChange() {
    // stop and reset all videos
    this.videos.forEach(video => {
      const videoElement = video.nativeElement;
      videoElement.pause();
      videoElement.currentTime = 0;
    });

    // play the video of the current slide if it is a video
    const currentSlide = this.mainSwiper.swiperRef.slides[this.currentIndex];
    const videoElement = currentSlide.querySelector('video');
    if (videoElement) {
      videoElement.play();
    }
  }

  ngOnInit(): void {
    this.itemChanged();
    this.currentIndex = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.itemChanged();
  }

  ngAfterViewInit(): void {
    this.activeIndexChangeSubscription = this.mainSwiper.s_activeIndexChange.subscribe(([swiper]) => {
      this.currentIndex = swiper.activeIndex;
    });
    this.onSlideChange();
  }

  ngOnDestroy(): void {
    this.activeIndexChangeSubscription.unsubscribe();
  }

  private itemChanged() {
    this.currentIndex = 0;
    this.spotlightMedia = this.singelItemService.getSpotLightImg(this.item);
    this.infoText = this.singelItemService.getInfoText(this.item);
    this.bulletPoints = this.singelItemService.getBulletPoints(this.item);
    this.mediaList = this.singelItemService.getMediaList(this.item);
    if (this.mediaList.length == 0) {
      this.mediaList.push(this.singelItemService.convertSpotlightMediaToRTCImage(this.spotlightMedia))
    }

    const spotlightMediaIndex = this.mediaList.findIndex(media => media.image === this.spotlightMedia.media);

    if (spotlightMediaIndex !== -1) {
      const [spotlightMedia] = this.mediaList.splice(spotlightMediaIndex, 1);
      this.mediaList.unshift(spotlightMedia);
    }
    setTimeout(() => {
      this.onSlideChange();
    }, 200);

    // setTimeout(() => {
    //   this.onThumbnailClick(spotlightMediaIndex)
    // }, 200);

    this.setHeightMediaBox(this.mediaList.length);
    if (this.activatedRoute.snapshot.params["page"] == "Privat" || this.activatedRoute.snapshot.params["page"] == "Företag") {
      this.showFullscreen = false;
    }
  }

  setHeightMediaBox(num: number) {
    switch (true) {
      case (num > 1 && num < 3):
        this.mHeight = "height: 18.5%";
        this.sHeight = "height: 61.5%";
        break;
      case (num > 2):
        this.mHeight = "height: 39.5%";
        this.sHeight = "height: 40.5%";
        break;
      default:
        this.mHeight = "height: 0%";
        this.sHeight = "height: 85%";
    }
  }

  changeSpotLightMedia(image: RTCImage) {
    this.spotlightMedia = this.singelItemService.changeSpotLightMedia(image);
    this.singelItemService.changeSpotLightMedia(image).isVideo
  }

  onThumbnailClick(index: number) {
    this.currentIndex = index;
    this.mainSwiper.swiperRef.slideTo(index, 200)
  }

  OnFullscreen() {
    this.dialog.open(FullscreenModalComponent, {
      panelClass: 'fullscreen-dialog',
      width: '1920px',
      height: '1080px',
      maxWidth: '1920px',
      data: [
        { images: this.mediaList },
        { currentImageIndex: this.currentIndex }
      ]
    });
  }
}
