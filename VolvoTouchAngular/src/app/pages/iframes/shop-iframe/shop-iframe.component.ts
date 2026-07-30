import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Observable, Subject, first, of } from 'rxjs';
import { BaseIframeComponent } from '../base-iframe/base-iframe.component';
import { IframeKeyBoardService } from 'src/app/services/Iframe-keyboard.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { ConfigService } from 'src/app/services/config.service';
import { LanguageService } from 'src/app/services/language.service';
import { IframeService } from 'src/app/services/iframe.service';
import { SalesPersonService } from 'src/app/components/sales-person/services/sales-selector.service';
import { SalesPerson } from 'src/app/components/sales-person/models/sales-person.model';
import { HttpParams } from '@angular/common/http';
import { NavigationService } from 'src/app/services/navigation.service';
import { PageCard } from 'src/app/enums/page-card-enum';
import { InteractionTrackingService } from 'src/app/services/Statistics/interaction-tracker.service';

@Component({
  selector: 'app-shop-iframe',
  templateUrl: './shop-iframe.component.html',
  styleUrls: ['./shop-iframe.component.scss']
})
export class ShopIframeComponent extends BaseIframeComponent {
  @ViewChildren('IFrame') iframe!: HTMLIFrameElement;
  url$: Observable<string> = new Observable<string>;
  isDesiredPage: boolean = false;
  dealerId: string;
  qrData: string;
  country: string = 'se';
  data: boolean;
  refresh$ = new Subject<any>();
  qrOrderUrl: any;
  showQr: boolean = false;
  pollingInterval: any;
  currentPath: string = "";
  selectedSalesPerson: SalesPerson;

  params = {
    'sales_channel': 'RetailAssisted',
    'utm_source': 'in-store',
    'utm_medium': 'qr',
    'utm_campaign': 'explorer',
    'dealer_associate': ''
  }

  constructor(
    keyBoardService: IframeKeyBoardService,
    screenSaverTimer: ScreenSaverTimerService,
    configService: ConfigService,
    private languageService: LanguageService,
    public IFrameService: IframeService,
    private salesPersonService: SalesPersonService,
    private navigationService: NavigationService,
    protected override interactionTracker: InteractionTrackingService
  ) { super(configService, screenSaverTimer, keyBoardService, interactionTracker) }
  
  CalledOnInit() { }
  
  CalledAfterViewInit() {
    this.country = this.languageService.getActiveCountry();
    this.getShopUrl();
    // this.startInterval();
    this.IFrameService.getEvent().subscribe(event => {
      if (event == 'reload') this.reload()
      else if (event == 'back') this.back()
      else if (event == 'country') {
        this.country = this.languageService.getActiveCountry();
        this.changeShopUrl();
      }
    })
   }

   ngOnDestroy() {
   }
  CalledIFramClickHandeler() { }
  CalledIFrameFocusHandler() { }

  updateCurrentPageStatus() { }

  startInterval() {
    this.navigationService.pageChanged$.subscribe(value => {
      let path = decodeURIComponent(value).split('/').filter(e => e);
      this.currentPath = path[0]

      if (this.currentPath == "Shop") {
        this.pollingInterval = setInterval(() => {
          this.checkUrlChange();
        }, 500)
      }
      else {
        clearInterval(this.pollingInterval);
        this.IFrameService.setBackBtn('false')
      }
    });
  }

  checkUrlChange() {
    var iframeUrl = this.iframe["first"].nativeElement.contentWindow.window.location.href;
    this.url$.subscribe(url => {
      if (iframeUrl != url) {
        this.IFrameService.setBackBtn('true')
      }
      else {
        this.IFrameService.setBackBtn('false')
      }
    }) 
  }

  updatePageStatus() {
    this.checkForOrderUrl()

    if (this.configService.config['VolvoEndlessAisle_Explorer']?.toString().toLowerCase() == "true") {
      this.salesPersonQr();
    }
    else {
      this.qrData = this.iframe["first"].nativeElement.contentWindow.window.location.href
    }

    this.showQrCode()
  }

  override onSetUp(doc: Document) {
    new MutationObserver(() => {
      this.updatePageStatus();
    }).observe(doc, { subtree: true, childList: true });
  }

  reload() {
    this.url$.subscribe(response => {this.iframe["first"].nativeElement.contentWindow.window.location.replace(response)})
  }

  back() {
    if (this.iframe["first"].nativeElement.contentWindow.window.history) {
      let back = document.getElementById("backiFrame");
      back.style.pointerEvents = "none";
      this.iframe["first"].nativeElement.contentWindow.window.history.back()
      setTimeout(() => {
        back.style.pointerEvents = "all";
      }, 500);
    }
  }

  checkForOrderUrl() {
    this.qrOrderUrl = this.iframe["first"].nativeElement.contentDocument.getElementsByClassName('button-outlined container-max')[0]
  }

  getOrderUrl() {
    var orderUrl = this.iframe["first"].nativeElement.contentDocument.getElementsByClassName('button-outlined container-max')[0].href
  }

  getShopUrl() {
    
    if(this.configService.config['VolvoEndlessAisle_DealerId']?.toString() == "AEWTP"){
      this.url$ = of(`https://www.volvocars.com/${this.country}/build/ex60-electric?kiosk=1`)
    }
    else{
      this.url$ = of(`https://www.volvocars.com/${this.country}/inventory/`)
    }
  }

  changeShopUrl() {
    var iframePath = this.iframe["first"].nativeElement.contentWindow.window.location.href
    if (iframePath != 'about:blank') {
      if (this.country == "zh-cn")
        this.url$ = of(`https://www.volvocars.com.cn/${this.country}/build/em90-electric?kiosk=1`)
      else {
        this.url$ = of(`https://www.volvocars.com/${this.country}/build/ex60-electric?kiosk=1`)
      }
    }
  }

  showQrCode() {
    const regex = new RegExp('^https://www\.volvocars\.com/' + this.country + '/order/');
    const regex2 = new RegExp('^https://www\.volvocars\.com/' + this.country + '/choose-offer/review');
    const regex3 = new RegExp('^https://www\.volvocars\.com/' + this.country + '/order-request/');
    const regex4 = new RegExp('^https://www\.volvocars\.com/' + this.country + '/quote?');
    const regex5 = new RegExp('^https://www\.volvocars\.com/' + this.country + '/inventory/car-locator');
    
    if (regex.test(this.qrData)){
      this.showQr = true;
    }
    else if (regex2.test(this.qrData)){
      this.showQr = true;
    }
    else if (regex3.test(this.qrData)){
      this.showQr = true;
    }
    else if (regex4.test(this.qrData)){
      this.showQr = true;
    }
    else if (regex5.test(this.qrData)){
      this.showQr = true;
    }
    else{
      this.showQr = false;
    }
  }

  salesPersonQr() {
    let iframe = this.iframe["first"].nativeElement.contentWindow.window.location.href
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
}