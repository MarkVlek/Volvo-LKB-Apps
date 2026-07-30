import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { DeliveryAgendaService } from '../../services/delivery-agenda.service';
import { ScreensaverService } from 'src/app/services/screen-saver.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { ConfigService } from 'src/app/services/config.service';
import { triggerSamePageRouting } from 'src/app/animations/route-to-same-page.animations';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation.service';
import { CastingService } from 'src/app/services/casting.service';
import { Agenda } from '../../models/agenda.model';
import { deliveryCarModelList } from 'src/app/data/DeliveryCarModels/DeliveryCarModelsData';
import { ScreenBrightnessService } from 'src/app/services/screen-brightness.service';

import { SwiperOptions } from 'swiper';
import { FdsData } from '../../models/agenda.model';
import { HttpClient } from '@angular/common/http';
import _ from 'lodash';
import { SwiperComponent } from 'swiper/angular';
import { StatisticService } from 'src/app/services/Statistics/statistics.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
  animations: [ triggerSamePageRouting ]
})
export class DeliveryComponent implements OnInit {
  @ViewChild('search', { static: false }) search: ElementRef;
  @ViewChild('firstName', { static: false }) firstName: ElementRef;
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent;

  category: any;
  searchValue: string = "";
  nameValue: string = "";
  searchWait: boolean = false;
  showDetails: boolean = false;
  enterName: boolean = false;
  errorMessage: string = '';
  rowHeight: string = '70px';
  placeHolder: string = '';
  isGlobal: boolean;
  Kista: boolean = false;
  market: string = "sv-SE"
  showFds: boolean = false;
  orderNo: string = "";
  currentNav: string[] = []
  powerOff: boolean = false;
  count: number = 0;
  todaysDate: Date;
  todaysDeliveries: number;
  fdsOrders: Record<string, FdsData[]>;
  fdsTimeSlots: number;
  fdsOrderNotes: string;
  searchOrderId: string = null;
  ordersLoaded: boolean = false;
  timeoutRef: any;
  timeoutDuration = 10 * 60 * 1000;
  events = ['click', 'touchstart'];
  public pageChange$: Subscription;
  public boolFadeIn = true;

  constructor(
    private router: Router,
    public deliveryAgendaService: DeliveryAgendaService,
    private screenSaverService: ScreensaverService,
    private screenSaverTimerService: ScreenSaverTimerService,
    public configService: ConfigService,
    private navigationService: NavigationService,
    private brightnessService: ScreenBrightnessService,
    public castingService: CastingService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private statisticsService: StatisticService
  ) { 

    this.pageChange$ = this.navigationService.pageChanged$.subscribe(value => {
      
      this.currentNav = decodeURIComponent(value).split('/').filter(e => e);
      
      if (this.currentNav[0] == PageCard.Delivery) {
        this.boolFadeIn = false;
        setTimeout(() => { this.boolFadeIn = true; }, 200);
      };

      if(this.currentNav.includes("noreg")) {
        this.enterName = true
      }

    });
  }

  ngOnInit() {
    // End any active session when returning to search page
    if (this.statisticsService.currentStatistic) {
      if (this.statisticsService.currentStatistic.App === 'DeliveryFeatures') {
        this.endDeliveryFeaturesSession();
      } else if (this.statisticsService.currentStatistic.App === 'Delivery') {
        this.endDeliverySession();
      }
    }

    if(this.configService.config['VolvoEndlessAisle_Showroom'] === 'true') {
      this.isGlobal = true;
      this.todaysDate = new Date();
      this.errorMessage = 'Order number could not be found'
      this.startInactivityTimer();

      this.getOrders();
      
      setTimeout(() => {
        this.search.nativeElement.value = localStorage.getItem('orderNo')
        this.orderNo = localStorage.getItem('orderNo')
      }, 100);
    }
    else {
      this.errorMessage = 'Registreringsnumret kunde inte hittas'
    }

    if (this.configService.config['VolvoEndlessAisle_Kista']?.toString().toLowerCase() == 'true') {
      this.Kista = true;
    }
    
    if (this.isGlobal) {
      this.rowHeight = '137px';
    }

    this.fitToWindow();

    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    if (localStorage.getItem('powerSaver') == 'false') {
      this.turnOff();
    }
  }

  ngOnDestroy() {
    this.stopInactivityTimer();
    // Don't end delivery features session here - it should persist across delivery pages
    // Session will be ended by app.component when returning to screensaver or changing apps
    // Unsubscribe from navigation events
    if (this.pageChange$) {
      this.pageChange$.unsubscribe();
    }
  }

  async onSearch(orderNumber: string = null) {
    this.searchWait = true;
    var regNumber: string = this.search.nativeElement.value;
    localStorage.setItem('orderNo', this.search.nativeElement.value)
    this.orderNo = localStorage.getItem('orderNo')

    if(this.isGlobal && orderNumber)
      regNumber = orderNumber;

    if (regNumber === undefined) {

      if(this.isGlobal)
        this.setErrorMessage('Type a valid ID');
      else
        this.setErrorMessage('Skriv in ett giltigt ID');

      this.searchWait = false;
      return;
    }

    if(this.configService.config['VolvoEndlessAisle_Showroom'] === 'true') {
      this.market = "en-US"
    }

    this.deliveryAgendaService.getAgendaByRegNumber(regNumber, this.market).subscribe({
      next: (res) => {

        this.zone.run(() =>{
        
          if (res) {
          this.deliveryAgendaService.agenda = res;
        
          if (this.deliveryAgendaService.agenda.customerName !== null) {
            this.firstName.nativeElement.value = this.deliveryAgendaService.agenda.customerName;
          }

          this.deliveryAgendaService.selectedRegnum = regNumber;
          this.searchWait = false;
          if (this.isGlobal) {
            this.showFds = true
            this.searchOrderId = null;
            const text = this.deliveryAgendaService.agenda.fdsData.orderDetails.orderNotes.match(/Comments:(.*?)CreatedBy:/s)
            this.fdsOrderNotes = text ? text[1].trim() : this.deliveryAgendaService.agenda.fdsData.orderDetails.orderNotes;
          }
          else
            this.showDetails = true;

          if(this.configService.config['VolvoEndlessAisle_ScreenSaverOn'].toString().toLowerCase() == 'true') {
            this.screenSaverTimerService.stopTimer();
          }

        } else {
          this.searchWait = false;
          this.searchOrderId = null;
          this.setErrorMessage(this.errorMessage);

          if(!this.isGlobal && !this.Kista) {
            this.router.navigate([PageCard.DeliveryModelSelector])
          }
        }

        this.cdr.detectChanges();
        });
      },
      error: (e) => {
        console.log(e);
        this.searchWait = false;
        this.searchOrderId = null;
        this.setErrorMessage(this.errorMessage);

        if(!this.isGlobal && !this.Kista) {
          this.router.navigate([PageCard.DeliveryModelSelector])
        }
        this.cdr.detectChanges();
      }
    })
  }

  setErrorMessage(message) {
    this.search.nativeElement.value = '';
    this.searchValue = '';
    this.search.nativeElement.placeholder = message;
    this.search.nativeElement.style.setProperty('--placeHolder-color', 'rgba(158, 42, 43, 1)');
  }

  detailsConfirm() {
    setTimeout(() => {
      this.showDetails = false;
      this.showFds = false;
      this.enterName = true;
      this.cdr.detectChanges();
    }, 300);
  }

  back() {
    this.showDetails = false
    this.showFds = false
    if(this.configService.config['VolvoEndlessAisle_ScreenSaverOn'].toString().toLowerCase() == 'true') {
      this.screenSaverTimerService.startTimer();
    }
  }

  continue(isName: boolean) {
    this.startDeliverySession();

    if(this.currentNav.includes('noreg'))
    {
        this.deliveryAgendaService.agenda = new Agenda();
        let deliveryCarModel = deliveryCarModelList.find(x => x.code == this.currentNav[2])
        this.deliveryAgendaService.agenda.screenSaverName = deliveryCarModel.screenSaver
        this.deliveryAgendaService.agenda.customerName = this.firstName.nativeElement.value;
        this.deliveryAgendaService.agenda.carModel = deliveryCarModel.name
        this.screenSaverTimerService.stopTimer();
        this.router.navigate([PageCard.DeliveryStart, "noreg"])
    }
    else {
      setTimeout(() => {
  if (isName && this.firstName.nativeElement.value) {
    this.deliveryAgendaService.agenda.customerName = this.firstName.nativeElement.value;

    this.deliveryAgendaService
      .postAgendaToGrassFeeder(this.deliveryAgendaService.agenda)
      .subscribe({
        next: (res) => {
          if (this.configService.config['VolvoEndlessAisle_ScreenSaverOn'].toString().toLowerCase() == 'true') {
            this.screenSaverTimerService.stopTimer();
          }

          if (this.configService.config['VolvoEndlessAisle_Showroom'] === 'true') {
            this.castingService.getPlayers();
            this.router.navigate([PageCard.DeliveryChooseAgenda]);
          } else {
            this.router.navigate([PageCard.DeliveryStart]);
          }

          this.enterName = false;
          this.showDetails = false;
          this.cdr.detectChanges();
        }
      });
  } else {
    this.deliveryAgendaService.agenda.customerName = "";

    this.deliveryAgendaService.postAgendaToGrassFeeder(this.deliveryAgendaService.agenda).subscribe({
          next: (res) => {
            if (this.configService.config['VolvoEndlessAisle_ScreenSaverOn'].toString().toLowerCase() == 'true') {
              this.screenSaverTimerService.stopTimer();
            }

            if (this.configService.config['VolvoEndlessAisle_Showroom'] === 'true') {
              console.log('Navivating to delivery choose agenda');
              this.castingService.getPlayers();
              this.router.navigate([PageCard.DeliveryChooseAgenda]);
            } else {
              console.log('Navivating to delivery start');
              this.router.navigate([PageCard.DeliveryStart]);
            }

            this.enterName = false;
            this.showDetails = false;
          }
        });
    }
    }, 300);


    } 

  }

  goToStandardScen() {
    this.router.navigate([PageCard.DeliveryKista]);
  }

  onKeyClick(value: string, isSearch) {

    if (!this.isGlobal) {
      this.search.nativeElement.placeholder = 'REGNUMMER eller VIN';
    }
    this.search.nativeElement.style.setProperty('--placeHolder-color', 'rgba(20, 20, 20, 1)');

    if (isSearch) {
      if (value == "back" && this.searchValue != "") {
        this.searchValue = this.searchValue.slice(0, -1);
      }
      else if (value != "back") {
        if (value == "Space") {
          console.log('no space')
        } else {
          this.searchValue += value;
        }
      }
      this.search.nativeElement.value = this.searchValue;
    }

    if (!isSearch) {
      if (value == "back" && this.nameValue != "") {
        this.nameValue = this.nameValue.slice(0, -1);
      }
      else if (value != "back") {
        if (value == "Space") {
          this.nameValue += " ";
        } else {
          this.nameValue += value;
        }
      }
      this.firstName.nativeElement.value = this.nameValue;
    }
  }

  fitToWindow() {
    var doc = document.getElementById('container') as HTMLDivElement;
    if (this.Kista) {
      doc.style.top = '-150px';
    }
  }

  finish() {

    if(!this.showDetails && this.enterName) {
      this.enterName = false;
      this.showDetails = true;
    }
    else if(this.showDetails) {
      this.showDetails = false
    }
  }


  turnOff() {
    this.powerOff = true;
    this.brightnessService.setBrightness('0.001');
    localStorage.setItem('powerSaver', 'false')
  }

  turnOn() {
    this.count += 1;
    if (this.count >= 3) {
      this.powerOff = false
      this.brightnessService.setBrightness('0.6');
      localStorage.setItem('powerSaver', 'true')
      this.castingService.getPlayers()
      this.startInactivityTimer();
      
      setTimeout(() => {
        this.castingService.castingStatus = Array.from(this.castingService.occupationStatus.entries()).map(([key, value]) => ({ key, value }))
        this.cdr.detectChanges();
      }, 500)
    }

    setTimeout(() => {
      this.count = 0;
    }, 2000);
  }

  fetchFdsOrders() {
    this.ordersLoaded = false;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const refreshTimeout = setTimeout(() => {
      console.log('Timeout, reloading')
      window.location.reload();
    }, 2 * 60 * 1000);

    this.deliveryAgendaService.fetchOrdersByDate(formattedDate).subscribe({
      next: (data) => {
        clearTimeout(refreshTimeout);
        this.zone.run(() => {
          if(data) {
            var fdsOrderList: FdsData[] = data;
        
            this.todaysDeliveries = fdsOrderList.length;
            
            this.fdsOrders = this.groupByDeliveryTime(fdsOrderList)
            this.fdsTimeSlots = Object.keys(this.fdsOrders).length;
            
            this.ordersLoaded = true;
            this.cdr.detectChanges();
          }
        })
      }
    })

    this.castingService.getPlayers()

    setTimeout(() => {
      this.castingService.castingStatus = Array.from(this.castingService.occupationStatus.entries()).map(([key, value]) => ({ key, value }))
      this.cdr.detectChanges()
    }, 1000)
  }

  getOrders() {
    this.ordersLoaded = false;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    // const formattedDate = '2025-07-07'

    this.deliveryAgendaService.getOrders(formattedDate).subscribe({
      next: (data) => {
        this.zone.run(() => {
          if(data) {
            var fdsOrderList: FdsData[] = data;
        
            this.todaysDeliveries = fdsOrderList.length;
            
            this.fdsOrders = this.groupByDeliveryTime(fdsOrderList)
            this.fdsTimeSlots = Object.keys(this.fdsOrders).length;
            
            this.ordersLoaded = true;
            this.cdr.detectChanges();
          }
        })
      }
    })

    this.castingService.getPlayers()

    setTimeout(() => {
      this.castingService.castingStatus = Array.from(this.castingService.occupationStatus.entries()).map(([key, value]) => ({ key, value }))
      this.cdr.detectChanges()
    }, 1000)
  }

  groupByDeliveryTime(data: FdsData[]): Record<string, FdsData[]> {
  return data.reduce((result, item) => {
      const time = item.bookingDetails.deliveryTime;
      if (!result[time]) {
        result[time] = [];
      }
      result[time].push(item);
      return result;
    }, {} as Record<string, FdsData[]>);
  }

  searchByOrder(orderNumber: string) {
    this.searchOrderId = orderNumber;
    this.onSearch(orderNumber);
  }

  swipeDown() {
    this.swiper.swiperRef.slideNext()
  }

  swipeUp() {
    this.swiper.swiperRef.slidePrev()
  }

  refresh() {
    window.location.reload();
  }

  startInactivityTimer() {
    this.resetTimer();
    this.events.forEach(event => {
      window.addEventListener(event, this.resetTimer)
    })
    console.log("Starting inactivity timer")
  }

  stopInactivityTimer() {
    clearTimeout(this.timeoutRef);
    this.events.forEach(event =>
      window.removeEventListener(event, this.resetTimer)
    );
    console.log("Stopping inactivity timer")
  }

  resetTimer = () => {
    clearTimeout(this.timeoutRef);
    this.timeoutRef = setTimeout(() => {
      console.log('User inactive');
      this.turnOff();
      this.stopInactivityTimer();
    }, this.timeoutDuration);
  };

  getStatus() {
    this.castingService.getPlayers()
    setTimeout(() => {
      this.castingService.castingStatus = Array.from(this.castingService.occupationStatus.entries()).map(([key, value]) => ({ key, value }))
      this.cdr.detectChanges()
    }, 500)
  }

  startDeliverySession() {
    // Create new statistic session for Delivery (welcome screen)
    this.statisticsService.currentStatistic = {
      DisplayPrefix: this.configService.playerName,
      App: 'Delivery',
      Dealer: this.configService.GetDealerID(),
      StartOfSession: new Date(),
      SessionLengthInSec: 0
    };
    this.statisticsService.startSession();
  }

  startDeliveryFeaturesSession() {
    // Create new statistic session for DeliveryFeatures
    this.statisticsService.currentStatistic = {
      DisplayPrefix: this.configService.playerName,
      App: 'DeliveryFeatures',
      Dealer: this.configService.GetDealerID(),
      StartOfSession: new Date(),
      SessionLengthInSec: 0
    };
    this.statisticsService.startSession();
  }

  endDeliverySession() {
    if (this.statisticsService.currentStatistic && this.statisticsService.currentStatistic.App === 'Delivery') {
      this.statisticsService.endAndPostCurrentSession(true, 2);
    }
  }

  endDeliveryFeaturesSession() {
    if (this.statisticsService.currentStatistic && this.statisticsService.currentStatistic.App === 'DeliveryFeatures') {
      this.statisticsService.endAndPostCurrentSession(true, 2);
    }
  }
}
