import { Component, Inject, Injectable, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RTCImage } from 'src/app/pages/reason-to-choose/rtc-models/rtc-image.model';

import SwiperCore, { Navigation, EffectFade, EffectCoverflow, EffectCube, EffectCards, EffectCreative, EffectFlip } from "swiper";
import { SwiperComponent } from 'swiper/angular';

SwiperCore.use([Navigation, EffectFade, EffectCoverflow, EffectCube, EffectCards, EffectCreative, EffectFlip]);

@Component({
  selector: 'app-fullscreen-modal',
  templateUrl: './fullscreen-modal.component.html',
  styleUrls: ['./fullscreen-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
@Injectable()
export class FullscreenModalComponent implements OnInit {

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  imgPathArr: string[]
  images: RTCImage[];
  currentImage: number;
  initialSlide: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: [images: RTCImage[], currentImage: string],
    public dialogRef: MatDialogRef<FullscreenModalComponent>) { }

  ngOnInit(): void {
    this.imgPathArr = [];
    console.log(this.data)
    this.images = this.data[0]["images"];
    this.images.forEach(img => {
      this.imgPathArr.push(img.image)
    })
    this.initialSlide = this.data[1]["currentImageIndex"];

  }

  close() {
    this.dialogRef.close();
  }

  isRealVideo(path: string): boolean {
    return path.endsWith('.mp4') || path.endsWith('.wmv');
  }
}
