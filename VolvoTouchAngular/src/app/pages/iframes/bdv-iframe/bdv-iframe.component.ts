import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { ConfigService } from 'src/app/services/config.service';
import { IframeKeyBoardService } from 'src/app/services/Iframe-keyboard.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { BaseIframeComponent } from 'src/app/pages/iframes/base-iframe/base-iframe.component';
import { LanguageService } from 'src/app/services/language.service';
import { IframeService } from 'src/app/services/iframe.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { InteractionTrackingService } from 'src/app/services/Statistics/interaction-tracker.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-bdv-iframe',
  templateUrl: './bdv-iframe.component.html',
  styleUrls: ['./bdv-iframe.component.scss']
})
export class BdvIframeComponent extends BaseIframeComponent {
  @ViewChild('Iframe') iframe!: HTMLIFrameElement;
  url$: Observable<string> = new Observable<string>();
  activeCountry: string = 'se';
  qrData: string;
  showQr: boolean = false;
  currentPath: string = "";
  pollingInterval: any;
  errorInterval: any;
  dealers: any[];

  readonly ERROR_TEXT = 'Application error: a client-side exception has occurred';

  constructor(
    private backendService: BackendService,
    private languageService: LanguageService,
    public IFrameService: IframeService,
    private navigationService: NavigationService,
    protected override interactionTracker: InteractionTrackingService,
    
    keyBoardService: IframeKeyBoardService,
    screenSaverTimer: ScreenSaverTimerService,
    configService: ConfigService,
    private tokenService: TokenService
    ) {
    super(configService, screenSaverTimer, keyBoardService,interactionTracker)
  }

  CalledOnInit() {
    this.qrData = `${this.url$}`
    this.activeCountry = this.languageService.getActiveCountry();
    this.setUrl();
    this.startInterval();

    this.IFrameService.getEvent().subscribe(event => {
      if (event == "back") this.back();
      if (event == "country") {
        this.activeCountry = this.languageService.getActiveCountry();
        this.setUrl();
        this.showQr = false;
        this.iframe["nativeElement"].contentWindow.window.sessionStorage.clear();
      }
      if (event == "reload") this.reload();
    })
  }

  CalledAfterViewInit() { }

  CalledIFramClickHandeler() { }

  CalledIFrameFocusHandler() { }

  setUrl(){
    if (this.configService.config["VolvoEndlessAisle_Explorer"]?.toString().toLowerCase() == "true") {
      const dealerId = this.configService.GetDealerID().toString();
      console.log(dealerId)
      this.url$ = of(`https://www.volvocars.com/${this.activeCountry}/build/ex60-electric?kiosk=1&dealerId=${dealerId}`)
      this.url$.subscribe(data => {
        console.log(data)
      })
    }
    else {
       this.url$ = of(`https://www.volvocars.com/${this.activeCountry}/build/ex60-electric?kiosk=1`)
    }
  }

  back() {
    if (this.iframe["nativeElement"].contentWindow.window.history) {
      let back = document.getElementById("backiFrame");
      back.style.pointerEvents = "none";
      this.iframe["nativeElement"].contentWindow.window.sessionStorage.clear();
      this.iframe["nativeElement"].contentWindow.window.history.back()
      setTimeout(() => {
        back.style.pointerEvents = "all";
      }, 500);
    }
  }

  reload() {
    if (!this.iframe?.["nativeElement"]?.contentWindow) {
      return;
    }

    this.iframe["nativeElement"].contentWindow.window.sessionStorage.clear();
    
    // Recreate the iframe src
    this.setUrl();
    this.url$.subscribe(url => {
      this.iframe["nativeElement"].src = url;
    }).unsubscribe();
    
    this.showQr = false;
  }

  startInterval() {
    this.navigationService.pageChanged$.subscribe(value => {
      let path = decodeURIComponent(value).split('/').filter(e => e);
      this.currentPath = path[0]

      if (this.currentPath == "Bygg din Volvo") {
        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
        }
        this.pollingInterval = setInterval(() => {
          this.getToken();
        }, 1000)
        this.errorInterval = setInterval(() => {
          this.checkForIframeError();
        }, 10000)
      }
      else {
        clearInterval(this.pollingInterval);
        clearInterval(this.errorInterval);
        this.IFrameService.setBackBtn('false')
      }
    });
  }

  getToken() {
    var iframeDoc = this.iframe["nativeElement"].contentWindow.document.getElementById('car-configurator-cce-token');

    if (iframeDoc) {
      const tokenValue = iframeDoc.getAttribute('data-cce-token');
      this.tokenService.onChange$.next(tokenValue);
    }
  }

  
  override onSetUp(doc: Document) { }

  private checkForIframeError(): void {
    try {
      const doc = this.iframe?.['nativeElement']?.contentWindow?.document;
      if (doc?.body?.textContent?.includes(this.ERROR_TEXT)) {
        this.handleIframeError();
      }
    } catch { }
  }

  private handleIframeError(): void {
    console.log('Bdv iframe: client-side error detected, reloading app...');
    this.iframe["first"].nativeElement.contentWindow.window.sessionStorage.clear();
    window.sessionStorage.clear();
    window.localStorage.clear();
    if ('caches' in window) {
      caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
    }
    window.location.reload();
  }
}
