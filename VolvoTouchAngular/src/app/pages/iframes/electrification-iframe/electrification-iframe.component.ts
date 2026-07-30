import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseIframeComponent } from 'src/app/pages/iframes/base-iframe/base-iframe.component';
import { ConfigService } from 'src/app/services/config.service';
import { IframeKeyBoardService } from 'src/app/services/Iframe-keyboard.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { InteractionTrackingService } from 'src/app/services/Statistics/interaction-tracker.service';

@Component({
  selector: 'app-electrification-iframe',
  templateUrl: './electrification-iframe.component.html',
  styleUrls: ['./electrification-iframe.component.scss']
})
export class ElectrificationIframeComponent extends BaseIframeComponent implements OnInit,AfterViewInit, OnDestroy {
  @ViewChild('IFrame') iframe!: ElementRef;
  url$: string = '';
  currentPath: string = '';

  constructor(
    keyBoardService: IframeKeyBoardService,
    screenSaverTimer: ScreenSaverTimerService,
    configService: ConfigService,
    private navigationService: NavigationService,
  protected override interactionTracker: InteractionTrackingService) {
    super(configService, screenSaverTimer, keyBoardService, interactionTracker)
  }

  override ngOnInit() {
    this.url$ = this.configService.GetElectrifcationUrl();
    this.navigationService.showBackButton = true;
    super.ngOnInit(); 
  }

  overridengAfterViewInit() {
    super.ngAfterViewInit(); 
  }

  CalledOnInit() {
    this.url$ = this.configService.GetElectrifcationUrl();
    this.navigationService.pageChanged$.subscribe(value => {
      let path = decodeURIComponent(value).split('/').filter(e => e);
      this.currentPath = path[0]

      if (this.currentPath != "Elektrifiering") {
        if (this.iframe?.nativeElement?.contentWindow?.location?.href != 'https://gfhvolstorage.z1.web.core.windows.net/touch/#/electrification') {
          this.url$ = this.configService.GetElectrifcationUrl();
        }
      }
    });
  }

  CalledAfterViewInit() {      
  }

  CalledIFramClickHandeler() {
  }

  CalledIFrameFocusHandler() {
  }

  override onSetUp(doc: Document) {
  }
 ngOnDestroy() {
    this.navigationService.showBackButton = false;
  }
}
