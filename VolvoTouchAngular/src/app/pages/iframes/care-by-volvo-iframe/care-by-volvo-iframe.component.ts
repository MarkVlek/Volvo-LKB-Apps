import { Component, ElementRef, ViewChild } from '@angular/core';
import { BaseIframeComponent } from 'src/app/pages/iframes/base-iframe/base-iframe.component';
import { ConfigService } from 'src/app/services/config.service';
import { IframeKeyBoardService } from 'src/app/services/Iframe-keyboard.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { InteractionTrackingService } from 'src/app/services/Statistics/interaction-tracker.service';


@Component({
  selector: 'app-care-by-volvo-iframe',
  templateUrl: './care-by-volvo-iframe.component.html',
  styleUrls: ['./care-by-volvo-iframe.component.scss'],
})
export class CareByVolvoIframeComponent extends BaseIframeComponent {
  @ViewChild('IFrame') iframe!: ElementRef;
  url$: string = '';
  showBack: boolean = false;
  startUrl: string;
  currentUrl: string;

  constructor(
    keyBoardService: IframeKeyBoardService,
    screenSaverTimer: ScreenSaverTimerService,
    configService: ConfigService,
  protected override interactionTracker: InteractionTrackingService) {
    super(configService, screenSaverTimer, keyBoardService, interactionTracker)
  }

  CalledOnInit() {
    this.url$ = this.configService.GetCareByVolvoUrl();
  }

  CalledAfterViewInit() { }

  CalledIFramClickHandeler() {
    setTimeout(() => {
      this.currentUrl = this.iframe.nativeElement.contentWindow.location.href;
      if (this.currentUrl != this.startUrl) {
        this.showBack = true;
      } else {
        this.showBack = false;
      }
    }, 300);
  }

  CalledIFrameFocusHandler() { }

  goBack() {
    this.showBack = false
    if (this.startUrl !== this.currentUrl) {
      this.iframe.nativeElement.contentWindow.history.back();
      setTimeout(() => {
        this.currentUrl = this.iframe.nativeElement.contentWindow.location.href;
        if (this.currentUrl != this.startUrl) {
          this.showBack = true;
        }
        else {
          this.showBack = false;
        }
      }, 2000);
    }
  }

  override onSetUp(doc: Document) {

  }
}