import { Component, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { BaseIframeComponent } from '../base-iframe/base-iframe.component';
import { ConfigService } from 'src/app/services/config.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { IframeKeyBoardService } from 'src/app/services/Iframe-keyboard.service';
import { IframeService } from 'src/app/services/iframe.service';
import { LanguageService } from 'src/app/services/language.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { CarModel, Filter } from './model/carmodel';
import { carModelList, filterList } from './data/carmodeldata';
import { Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { InteractionTrackingService } from 'src/app/services/Statistics/interaction-tracker.service';


@Component({
  selector: 'app-fabf-iframe',
  templateUrl: './fabf-iframe.component.html',
  styleUrls: ['./fabf-iframe.component.scss']
})
export class FabfIframeComponent extends BaseIframeComponent {
  @ViewChildren('IFrame') iframe!: HTMLIFrameElement;
  url$: string = '';
  isDesiredPage: boolean = false;
  language: string;
  iframeLocation: string;
  pollingInterval: any;
  currentPath: string = "";
  carModels: CarModel[] = [];
  allCarModels: CarModel[] = [];
  carFilters: Filter[] = [];
  selectedFilter: string = 'Alla';
  selectedCar: string = 'es90-electric'
  showLanding: boolean = true;
  isLoading: boolean = false;

  constructor(
    configService: ConfigService,
    ScreenSaverTimerService: ScreenSaverTimerService,
    keyBoardService: IframeKeyBoardService,
    private languageService: LanguageService,
    private IFrameService: IframeService,
    private navigationService: NavigationService,
    protected override interactionTracker: InteractionTrackingService,
    private router: Router){
      super(configService, ScreenSaverTimerService, keyBoardService, interactionTracker)
      this.allCarModels = carModelList;
      this.carFilters = filterList;
    }

  CalledOnInit() {
    this.carModels = this.allCarModels;
    this.showLanding = true;
    this.language = this.languageService.getActiveLanguage();
    this.setUrl();
    this.startInterval();
    this.IFrameService.getEvent().subscribe(event => {
      if (event == 'reload') this.reload()
      else if (event == 'back') this.back()
      else if (event == 'language') {
        this.language = this.languageService.getActiveLanguage();
        // this.setUrl()
        this.showLanding = true;
      }
    })
  }

  
  CalledAfterViewInit(){
    const iframeEl = this.iframe["first"]?.nativeElement;
    if (iframeEl) {
      this.IFrameService.setupStyleInjection(iframeEl);
    }
  }

  ngOnDestroy() {
    const iframeEl = this.iframe["first"]?.nativeElement;
    if (iframeEl) {
      this.IFrameService.disconnect(iframeEl);
    }
  }
  
  CalledIFramClickHandeler() { }
  
  CalledIFrameFocusHandler() { }

  override onSetUp(doc: Document) {
    this.language = this.languageService.getActiveLanguage();
    // this.setUrl()
    new MutationObserver(() => {
    }).observe(doc, { subtree: true, childList: true });
  }

  setUrl(){
    if (this.language == "se"){
      this.url$ = `https://www.volvocars.com/se/cars/${this.selectedCar}/`
    }
    else{
      this.url$ = `https://www.volvocars.com/uk/cars/${this.selectedCar}/`
    }
  }

  startInterval() {
    this.navigationService.pageChanged$.subscribe(value => {
      let path = decodeURIComponent(value).split('/').filter(e => e);
      this.currentPath = path[0]
      this.showLanding = true;
      if (this.currentPath == "Our Cars") {
        this.pollingInterval = setInterval(() => {
          this.checkUrlChange();
        }, 500)
      }
      else {
        clearInterval(this.pollingInterval);
        this.IFrameService.setBackBtn('false');
        this.IFrameService.setRefresh('false'); 
      }
    });
  }

  checkUrlChange() {
    if (this.showLanding == false) {
      this.IFrameService.setBackBtn('false');  // Hide back button
      this.IFrameService.setRefresh('true');   // Show refresh button
    }
    else {
      this.IFrameService.setBackBtn('false');
      this.IFrameService.setRefresh('false');
    }
  }


  back(){
    this.iframeLocation = this.iframe["first"].nativeElement.contentWindow.window.href;

    if (this.iframe["first"].nativeElement.contentWindow.window.history && this.iframeLocation != this.url$) {
      let back = document.getElementById("backiFrame");
      back.style.pointerEvents = "none";
      this.iframe["first"].nativeElement.contentWindow.window.sessionStorage.clear();
      this.iframe["first"].nativeElement.contentWindow.window.history.back()

      setTimeout(() => {
        back.style.pointerEvents = "all";
      }, 500);
    }
  }

  reload(){
    // var firstPage = this.url$
    // if (this.iframe["first"].nativeElement.contentWindow.window.history) {
    //   this.iframe["first"].nativeElement.contentWindow.window.location.replace(firstPage)
    //   this.IFrameService.setBackBtn("false")
    // }
    this.showLanding = true;
  }

  checkIframeUrl(){
    const iframeLocation = this.iframe["first"].nativeElement.contentWindow.window.location.href
    if(iframeLocation != this.url$){
      this.IFrameService.setBackBtn("true")
    }
    else{
      this.IFrameService.setBackBtn("false")
    }
  }

  filterByDriveline(driveline: string) {
    this.selectedFilter = driveline;
    if (driveline === 'Alla') this.carModels = this.allCarModels;
    else this.carModels = this.allCarModels.filter(car => car.driveline === driveline);
  }

  setPdpUrl(car: string) {
    this.isLoading = true;
    var language = this.language == 'se' ? 'se' : 'uk';
    this.url$ = `https://www.volvocars.com/${language}/cars/${car}/`
    
    // if (car === 'ex60-electric') {
    //   this.router.navigate([PageCard.LaunchIframe]);
    //   this.navigationService.pageCardClicked$.next(PageCard.LaunchIframe);
    //   this.isLoading = false;
    // }
    if (car != this.selectedCar) {
      this.iframe["first"].nativeElement.addEventListener('load', () => {
        this.isLoading = false;
        this.showLanding = false;
      });
    }
    else {
      this.isLoading = false;
      this.showLanding = false;
    }

    this.selectedCar = car;
  }
}