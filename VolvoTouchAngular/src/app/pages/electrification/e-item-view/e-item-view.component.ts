import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RTCItem } from '../../reason-to-choose/rtc-models/rtc-item.model';
import { SpotlightMedia } from '../../reason-to-choose/interfaces/SpotLightMedia.interface';
import { RTCImage } from '../../reason-to-choose/rtc-models/rtc-image.model';
import { RTCSingleViewService } from '../../reason-to-choose/services/rtc-single-view.service';
import { MatDialog } from '@angular/material/dialog';
import { FullscreenModalComponent } from 'src/app/modals/fullscreen-modal/fullscreen-modal.component';

@Component({
  selector: 'app-e-item-view',
  templateUrl: './e-item-view.component.html',
  styleUrls: ['./e-item-view.component.scss']
})
export class EItemViewComponent implements OnInit, OnChanges {
  @Input() item: RTCItem;
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

  constructor(
    public singelItemService: RTCSingleViewService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.itemChanged();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.itemChanged();
  }

  private itemChanged() {
    this.spotlightMedia = this.singelItemService.getSpotLightImg(this.item);
    this.infoText = this.singelItemService.getInfoText(this.item);
    this.bulletPoints = this.singelItemService.getBulletPoints(this.item);
    this.mediaList = this.singelItemService.getMediaList(this.item);
    this.setHeightMediaBox(this.mediaList.length);
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
  }

  OnFullscreen() {
    this.dialog.open(FullscreenModalComponent, {
      panelClass: 'fullscreen-dialog',
      width: '1920px',
      height: '1080px',
      maxWidth: '1920px',
      data: [
        { images: this.mediaList },
        { currentImage: this.spotlightMedia }
      ]
    });
  }

  handleImageError(event) {
    // Replace with placeholder
    event.target.src = './assets/images/imagenotfound.png';
  }
  
  handleVideoError(event) {
    // Replace video with placeholder image or video
    event.target.parentElement.src = './assets/images/imagenotfound.png';
  }
  
}