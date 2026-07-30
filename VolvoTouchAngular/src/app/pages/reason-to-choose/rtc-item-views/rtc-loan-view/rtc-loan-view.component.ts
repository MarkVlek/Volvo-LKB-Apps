import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RTCChooseItemService } from '../../services/rtc-choose-item-service';
import { SpotlightMedia } from '../../interfaces/SpotLightMedia.interface';
import { RTCItem } from '../../rtc-models/rtc-item.model';
import { RTCSingleViewService } from '../../services/rtc-single-view.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-rtc-loan-view',
  templateUrl: './rtc-loan-view.component.html',
  styleUrls: ['./rtc-loan-view.component.scss']
})
export class RtcLoanViewComponent implements OnInit, OnChanges {
  @Input() item: RTCItem;
  spotlightMedia: SpotlightMedia;
  infoText: string;
  bulletPoints: string[];

  constructor(
    public itemService: RTCChooseItemService,
    public singelItemService: RTCSingleViewService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.itemChanged();
  }

  ngOnChanges(_: SimpleChanges): void {
    this.itemChanged();
  }

  private itemChanged() {
    this.spotlightMedia = this.singelItemService.getSpotLightImg(this.item);
    this.infoText = this.singelItemService.getInfoText(this.item);
    this.bulletPoints = this.singelItemService.getBulletPoints(this.item)
  }
}
