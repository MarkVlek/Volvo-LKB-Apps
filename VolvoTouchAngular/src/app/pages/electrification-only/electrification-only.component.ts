import { Component, ElementRef, ViewChild } from '@angular/core';
import { BaseIframeComponent } from '../iframes/base-iframe/base-iframe.component';
import { IframeKeyBoardService } from 'src/app/services/Iframe-keyboard.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { ConfigService } from 'src/app/services/config.service';
import { InteractionTrackingService } from 'src/app/services/Statistics/interaction-tracker.service';

@Component({
  selector: 'app-electrification-only',
  templateUrl: './electrification-only.component.html',
  styleUrls: ['./electrification-only.component.scss']
})
export class ElectrificationOnlyComponent extends BaseIframeComponent {
  @ViewChild('IFrame') iframe!: ElementRef;
  url$: string = '';
  showroom: string;

  constructor(
    keyBoardService: IframeKeyBoardService,
    screenSaverTimer: ScreenSaverTimerService,
    protected override interactionTracker: InteractionTrackingService,
    configService: ConfigService) {
    super(configService, screenSaverTimer, keyBoardService, interactionTracker)
  }

  CalledOnInit() {
    this.url$ = this.configService.GetElectrifcationUrl();
    this.ifShowRoom();
  }

  CalledAfterViewInit() {
  }

  CalledIFramClickHandeler() {
  }

  CalledIFrameFocusHandler() {
  }

  ifShowRoom() {
    if (this.configService.config["VolvoEndlessAisle_Showroom"]?.toString().toLowerCase() == "true") {
      this.showroom = "915px";
    }
    else{
      this.showroom = "1080px";
    }
  }

  override onSetUp(doc: Document) {

  }
}