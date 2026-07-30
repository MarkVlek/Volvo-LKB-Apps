import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RTCItem } from '../../rtc-models/rtc-item.model';
import { SpotlightMedia } from '../../interfaces/SpotLightMedia.interface';
import { RTCChooseItemService } from '../../services/rtc-choose-item-service';
import { RTCSingleViewService } from '../../services/rtc-single-view.service';

@Component({
  selector: 'app-rtc-carpay-view',
  templateUrl: './rtc-carpay-view.component.html',
  styleUrls: ['./rtc-carpay-view.component.scss']
})
export class RtcCarpayViewComponent implements OnInit, OnChanges {
  @Input() item: RTCItem;
  spotlightMedia: SpotlightMedia;
  infoText: string;
  bulletPoints: string[];

  constructor(
    public itemService: RTCChooseItemService,
    public singelItemService: RTCSingleViewService) { }

  ngOnInit(): void {
    this.itemChanged();
  }

  ngOnChanges(_: SimpleChanges): void {
    this.itemChanged();
  }

  private itemChanged() {
    this.spotlightMedia = this.singelItemService.getSpotLightImg(this.item);
    this.infoText = this.singelItemService.getInfoText(this.item);
    this.bulletPoints = this.singelItemService.getBulletPoints(this.item);
  }
}