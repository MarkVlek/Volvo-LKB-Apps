import { ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BaseIframeComponent } from 'src/app/pages/iframes/base-iframe/base-iframe.component';
import { ConfigService } from 'src/app/services/config.service';
import { PageCard } from 'src/app/enums/page-card-enum';
import { IframeKeyBoardService } from 'src/app/services/Iframe-keyboard.service';
import { IframeService } from 'src/app/services/iframe.service';
import { LanguageService } from 'src/app/services/language.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { InteractionTrackingService } from 'src/app/services/Statistics/interaction-tracker.service';

@Component({
  selector: 'app-launch-iframe',
  templateUrl: './launch-iframe.component.html',
  styleUrls: ['./launch-iframe.component.scss']
})
export class LaunchIframeComponent extends BaseIframeComponent {
  @ViewChild('launchIframe') iframe!: ElementRef;
  url$: Observable<string> = new Observable<string>;
  country: string;
  currentPath: string = "";
  scrolledToBottom: boolean = false;
  activeCountries = ['se','no','dk','es','de','nl'];
  showroom: boolean = false;
  dealerId;
  private isDragging = false;
  private dragThreshold = 5;
  private startPos: { x: number; y: number } | null = null;
  private startedInside = false;
  private iframeListenersAdded = false;
  private iframeDragging = false;
  private iframeTouchStartPos: { x: number; y: number } | null = null;

  constructor(
    keyBoardService: IframeKeyBoardService,
    screenSaverTimer: ScreenSaverTimerService,
    configService: ConfigService,
    private navigationService: NavigationService,
    private IFrameService: IframeService,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef,
    protected override interactionTracker: InteractionTrackingService,
    private zone: NgZone) {
    super(configService, screenSaverTimer, keyBoardService,interactionTracker)
  }

CalledOnInit() {  
  this.showroom = this.configService.config['VolvoEndlessAisle_Showroom'].toString().toLowerCase() === 'true';

  this.dealerId = this.configService.GetDealerID();
  this.country = this.languageService.getActiveCountry();

  this.IFrameService.getEvent().subscribe(event => {
    if (!this.IFrameService.currentIFrame.active || this.IFrameService.currentIFrame.name !== PageCard.LaunchIframe) return;
    if (!this.showroom && this.currentPath !== "EX60") return;
    if (event == 'country') {
      this.country = this.languageService.getActiveCountry();
      this.changeUrl();
    }
    // if (event == "reload") this.reload();
    // if (event == "back") this.goBackToEX60();
  })
  this.navigationService.pageChanged$.subscribe(value => {  
    let path = decodeURIComponent(value).split('/').filter(e => e);
    this.currentPath = path[0];
    
    if (this.currentPath !== "EX60") {
      if (this.iframe.nativeElement.contentWindow.window.location.href !== `https://www.volvocars.com/${this.country}/cars/ex60-electric/`) {
        this.iframe.nativeElement.contentWindow.window.location.href = `https://www.volvocars.com/${this.country}/cars/ex60-electric/`;
      }
    }
  });
  }

  CalledAfterViewInit() {
    this.iframe?.nativeElement?.contentWindow.window.location.replace(this.configService.GetLaunchIframeUrl('se'))
  }

  CalledIFramClickHandeler() {
  }

  CalledIFrameFocusHandler() {
  }

  override onSetUp(doc: Document) {

  }

  override onIframeLoaded(iframe: HTMLIFrameElement): void {
    const attrSrc = iframe.getAttribute('src') || '';
    if (!attrSrc || attrSrc === 'about:blank') return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const run = () => {
      doc.removeEventListener('click', this.iFrameClickHandler);
      doc.removeEventListener('focusin', this.iFrameFocusHandler);
      doc.addEventListener('click', this.iFrameClickHandler.bind(this), false);
      doc.addEventListener('focusin', this.iFrameFocusHandler.bind(this), false);

      this.IFrameService.setupStyleInjection(iframe);
    };

    if (doc.readyState === 'complete' || doc.readyState === 'interactive') {
      requestAnimationFrame(run);
    } else {
      doc.addEventListener('readystatechange', function onReady() {
        if (doc.readyState === 'complete' || doc.readyState === 'interactive') {
          doc.removeEventListener('readystatechange', onReady);
          requestAnimationFrame(run);
        }
      });
    }
  }

  changeUrl() {
    if (this.activeCountries.includes(this.country)) {
      this.url$ = of(this.configService.GetLaunchIframeUrl(this.country));
      this.scrolledToBottom = false;
    }
    else
      this.url$ = of(this.configService.GetLaunchIframeUrl('intl'));
  }

  reload() {
    this.iframe.nativeElement.contentWindow.window.sessionStorage.clear();
    this.iframe.nativeElement.contentWindow.window.location.reload();
  }

  ngOnDestroy(): void {
    if (this.iframe?.nativeElement?.contentWindow && this.iframeListenersAdded) {
      const win = this.iframe.nativeElement.contentWindow;
      this.iframeListenersAdded = false;
    }
  }
}
