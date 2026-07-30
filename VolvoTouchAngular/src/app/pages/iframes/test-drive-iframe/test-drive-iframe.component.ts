import { Component, ViewChildren, inject } from '@angular/core';
import { last, Observable, of } from 'rxjs';
import { IframeKeyBoardService } from 'src/app/services/Iframe-keyboard.service';
import { ConfigService } from 'src/app/services/config.service';
import { LanguageService } from 'src/app/services/language.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { BaseIframeComponent } from '../base-iframe/base-iframe.component';
import { IframeService } from 'src/app/services/iframe.service';
import { SalesPerson } from 'src/app/components/sales-person/models/sales-person.model';
import { HttpParams } from '@angular/common/http';
import { SalesPersonService } from 'src/app/components/sales-person/services/sales-selector.service';
import { PageCard } from 'src/app/enums/page-card-enum';
import { NavigationService } from 'src/app/services/navigation.service';
import { InteractionTrackingService } from 'src/app/services/Statistics/interaction-tracker.service';

@Component({
  selector: 'app-test-drive-iframe',
  templateUrl: './test-drive-iframe.component.html',
  styleUrls: ['./test-drive-iframe.component.scss']
})

export class TestDriveIframeComponent extends BaseIframeComponent {
  @ViewChildren('IFrame') iframe: HTMLIFrameElement;

  url$: Observable<string> = new Observable<string>;
  isDesiredPage: boolean = false;
  activeCountry: string = 'se';
  qrData: string;
  carModel: string;
  dealerName: string;
  dealerId: string;
  dealers: any[];
  iframeLocation: string;
  showQr: boolean = false;
  selectedSalesPerson: SalesPerson;
  isLoading: boolean = false;
  private loadListener: (() => void) | null = null;

  lastErrorReloadTime: number = 0;
  readonly ERROR_TEXT = 'Application error: a client-side exception has occurred';
  readonly RELOAD_COOLDOWN_MS = 10000;

  params = {
    'sales_channel': 'RetailAssisted',
    'utm_source': 'in-store',
    'utm_medium': 'qr',
    'utm_campaign': 'explorer',
    'dealer_associate': ''
  }
  pollingInterval: any;
  currentPath: string = "";

  constructor(
    public screenSaverTimer: ScreenSaverTimerService,
    configService: ConfigService,
    keyboardService: IframeKeyBoardService,
    private languageService: LanguageService,
    private IFrameService: IframeService,
    private salesPersonService: SalesPersonService,
    private navigationService: NavigationService,
    protected override interactionTracker: InteractionTrackingService
  ){
    super(configService, screenSaverTimer, keyboardService, interactionTracker)
  }

  CalledOnInit() {
    if (this.configService.config['VolvoEndlessAisle_Explorer']?.toString().toLowerCase() != "true") this.resetLanguage();
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
        this.iframe["first"].nativeElement.contentWindow.window.sessionStorage.clear();
      }
      if (event == "reload") this.reload();
    })
  }

  
  CalledAfterViewInit(){ }
  
  CalledIFramClickHandeler() { }
  
  CalledIFrameFocusHandler() { }

  startInterval() {
    this.navigationService.pageChanged$.subscribe(value => {
      let path = decodeURIComponent(value).split('/').filter(e => e);
      this.currentPath = path[0]

      if (this.currentPath == "Test Drive") {
        this.IFrameService.setRefresh('true')
        this.pollingInterval = setInterval(() => {
          this.checkForIframeError();
        }, 10000)
      }
      else {
        clearInterval(this.pollingInterval);
        this.IFrameService.setRefresh('false')
      }
    });
  }

  checkUrlChange() {
    var iframeUrl = this.iframe["first"].nativeElement.contentWindow.window.location.href;
    if(this.configService.config['VolvoEndlessAisle_Explorer']?.toString().toLowerCase() == "true") {
      const dealerId = this.configService.GetDealerID().toString();
      if (iframeUrl != `https://www\.volvocars\.com/${this.activeCountry}/test-drive-booking?retailerid=${dealerId}`) {
        this.IFrameService.setBackBtn('true')
      }
      else {
        this.IFrameService.setBackBtn('false')
      }
    }
    else {
      if (iframeUrl != `https://www\.volvocars\.com/${this.activeCountry}/test-drive-booking/`) {
        this.IFrameService.setBackBtn('true')
      }
      else {
        this.IFrameService.setBackBtn('false')
      }
    }
  }

  updatePageStatus() {
    if (this.iframe) {
      const locale = this.languageService.getActiveCountry();
      const retailerId = this.configService.GetDealerID();
    }
  }

  override onSetUp(doc: Document) {
    new MutationObserver(() => {
      this.updatePageStatus();
      this.getCarModelAndDealer();
    }).observe(doc, { subtree: true, childList: true });
  }

  back() {
    if (this.iframe["first"].nativeElement.contentWindow.window.history) {
      let back = document.getElementById("backiFrame");
      back.style.pointerEvents = "none";
      this.iframe["first"].nativeElement.contentWindow.window.sessionStorage.clear();
      this.iframe["first"].nativeElement.contentWindow.window.history.back()
      setTimeout(() => {
        back.style.pointerEvents = "all";
      }, 500);
    }
  }

  reload() {
    this.iframe["first"].nativeElement.contentWindow.window.sessionStorage.clear();
    this.url$.subscribe(response => {this.iframe["first"].nativeElement.contentWindow.window.location.replace(response)}) 
    this.showQr = false;
  }

  setUrl(){
    if (this.configService.config["VolvoEndlessAisle_Explorer"]?.toString().toLowerCase() == "true") {
      const dealerId = this.configService.GetDealerID().toString();

      this.url$ = of(`https://www.volvocars.com/${this.activeCountry}/test-drive-booking?retailerid=${dealerId}?v=${Date.now()}`)
    }
    else {
      if (this.activeCountry == "zh-cn")
        this.url$ = of(`https://www.volvocars.com/${this.activeCountry}/l/test-drive/`)
      else if (this.activeCountry == "us")
        this.url$ = of(`https://www.volvocars.com/${this.activeCountry}/form/test-drive/`)
      else
        this.url$ = of(`https://www.volvocars.com/${this.activeCountry}/test-drive-booking?v=${Date.now()}`)
    }
  }


  getDealerId() {
    const selectedDealer = this.dealers
    .find(dealer => dealer['name'] === this.dealerName)

    this.dealerId = selectedDealer['dealerId']
  }

  setQrData() {
    if (this.configService.config['VolvoEndlessAisle_Explorer']?.toString().toLowerCase() == 'true') {
      this.salesPersonQr();
      this.showQr = true;
    }
    else if (this.iframeLocation == this.IFrameService.getTestDriveFormUrl(this.activeCountry)){
      this.qrData = `https://volvocars.com/${this.activeCountry}/test-drive-booking/requests/form?retailerid=${this.dealerId}&model=${this.carModel}`
      this.showQr = true;
    }
    else if (this.iframeLocation == this.IFrameService.getTestDriveRequestFormUrl(this.activeCountry)){
      this.qrData = `https://volvocars.com/${this.activeCountry}/test-drive-booking/requests/form?retailerid=${this.dealerId}&model=${this.carModel}`
      this.showQr = true;
    }
    else if (this.iframeLocation == this.IFrameService.getTestDriveCalendarUrl(this.activeCountry) || this.iframeLocation == this.IFrameService.getTestDriveLeadsCalendarUrl(this.activeCountry)){
      this.qrData = `https://volvocars.com/${this.activeCountry}/test-drive-booking/dealer/calendar?retailerid=${this.dealerId}&model=${this.carModel}`
      if (this.dealerId == 'AEWTP') {
        this.qrData = `http://www.volvocars.com/${this.activeCountry}/test-drive-booking?modelkey=${this.carModel.split('%')[0]}-electric&retailerid=${this.dealerId}`
      }
      this.showQr = true;
    }
  }

  getCarModelAndDealer() {
    this.iframeLocation = this.iframe["first"].nativeElement.contentWindow.window.location.href.toString()

    if (this.iframeLocation == this.IFrameService.getTestDriveCalendarUrl(this.activeCountry) || this.iframeLocation == this.IFrameService.getTestDriveLeadsCalendarUrl(this.activeCountry)) {
    var car = this.iframe["first"].nativeElement.contentDocument.getElementsByClassName('a ah ai gl gm gn go gp gq gr gs gt gu gv gw gx gy gz ha hb hc hd he')[0].innerText
    this.dealerName = this.iframe["first"].nativeElement.contentDocument.getElementsByClassName('journey-progress__box__info')[0].getElementsByTagName('p')[0].innerText
    this.carModel = car.replace(' ', '%20')

    this.getDealerId();
    this.setQrData();
    }

    else if (this.iframeLocation == this.IFrameService.getTestDriveFormUrl(this.activeCountry)){
    var car = this.iframe["first"].nativeElement.contentDocument.getElementsByClassName('a ab ac ae af ag ah k l m n o p q r s t u v w x y z')[0].innerText
    this.dealerName = this.iframe["first"].nativeElement.contentDocument.getElementsByClassName('journey-progress__box__info')[0].getElementsByTagName('p')[0].innerText
    this.carModel = car.replace(' ', '%20')
    
    this.getDealerId();
    this.setQrData();
    }

    else if (this.iframeLocation == this.IFrameService.getTestDriveRequestFormUrl(this.activeCountry)) {
    var car = this.iframe["first"].nativeElement.contentDocument.getElementsByClassName('a ab ac ae af ag ah k l m n o p q r s t u v w x y z')[0].innerText
    this.dealerName = this.iframe["first"].nativeElement.contentDocument.getElementsByClassName('journey-progress__box__info')[0].getElementsByTagName('p')[0].innerText
    this.carModel = car.replace(' ', '%20')

    this.getDealerId();
    this.setQrData();
    }
    
    else {this.showQr = false;}
  }

  salesPersonQr() {
    let iframe = `https://volvocars.com/${this.activeCountry}/test-drive-booking/dealer/calendar?retailerid=${this.dealerId}&model=${this.carModel}`
    this.dealerId = this.configService.GetDealerID();
    this.params['dealer_associate'] = this.dealerId;
    this.selectedSalesPerson = this.salesPersonService.current

    this.qrData = `${iframe}?${new HttpParams({fromObject: this.params}).toString()}`
      let tempUrl = new URL(iframe);
      if (!this.selectedSalesPerson) {
        console.error('No selected sales person')
      }
      else {
        tempUrl.searchParams.append('selling_dealer', this.selectedSalesPerson.SalesId)
      }

      const paramsArray: [string, string][] = Object.entries(this.params);
      
      paramsArray.forEach(element => {
        tempUrl.searchParams.append(element[0], element[1]);
      });

      this.qrData = `${tempUrl.href}`
  }

  resetLanguage() {
    this.languageService.setActiveCountry('se')
    this.languageService.setActiveCountryName('Sverige')
    this.languageService.setActiveLanguage('se')
    this.IFrameService.setEvent('country')
    this.IFrameService.setEvent('language')
  }

  setupLoadListener() {
    const iframeEl = this.iframe?.["first"]?.nativeElement;
    if (!iframeEl) return;

    if (this.loadListener) {
      iframeEl.removeEventListener('load', this.loadListener);
    }

    this.loadListener = () => {
      this.isLoading = false;
    };

    iframeEl.addEventListener('load', this.loadListener);
  }

  private checkForIframeError(): void {
    try {
      const doc = this.iframe['first'].nativeElement?.contentWindow?.document;
      console.log(doc)
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
