import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DeliveryAgendaService } from '../../services/delivery-agenda.service';
import { changeBackgroundColor, changeColor } from 'src/app/animations/gray-out.animation';

import SwiperCore, { Navigation, EffectFade, EffectCoverflow, EffectCube, EffectCards, EffectCreative, EffectFlip, SwiperOptions } from "swiper";
import { SwiperComponent } from 'swiper/angular';
import { SwiperEvents } from 'swiper/types';
import { fadeAnimation } from 'src/app/animations/simple-fade.animation';
import { Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { ConfigService } from 'src/app/services/config.service';
import { CastingService } from 'src/app/services/casting.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { ScreenBrightnessService } from 'src/app/services/screen-brightness.service';
SwiperCore.use([Navigation, EffectFade, EffectCoverflow, EffectCube, EffectCards, EffectCreative, EffectFlip]);

@Component({
  selector: 'app-delivery-choose-agenda',
  templateUrl: './delivery-choose-agenda.component.html',
  styleUrls: ['./delivery-choose-agenda.component.scss'],
  animations: [changeBackgroundColor, changeColor, fadeAnimation]
})
export class DeliveryChooseAgendaComponent implements OnInit, AfterViewInit {
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent;
  @ViewChild('header') header: ElementRef;
  @ViewChild('next') next: ElementRef;
  @ViewChild('point') point: ElementRef;

  private swiperSpeed: number = 500;
  public agendas: any[] = [];
  private linkToMobileSite: string = "https://grassfeeder.grassfish.com/volvo/app/delivery/"
  public qrCodeLink: string = null;
  public loadingQr: boolean = true;
  public loading: boolean = true;
  public HasCasted: boolean = false;
  public agendaSteps = []
  public market: string = "sv-SE"
  public powerOff: boolean = false;
  public count: number = 0;
  timeoutRef: any;
  timeoutDuration = 10 * 60 * 1000;
  events = ['click', 'touchstart'];

  public isTablet: boolean = false;
  public isKista: boolean = false;
  public castingPlayers: string[] = []

  constructor(
    public deliveryAgendaService: DeliveryAgendaService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public configService: ConfigService,
    public castingService: CastingService,
    private screenSaverTimerService: ScreenSaverTimerService,
    private brightnessService: ScreenBrightnessService) { }

  ngOnInit(): void {
    if(this.configService.config['VolvoEndlessAisle_CastingPlayers'] != null) {
      this.castingPlayers = this.configService.config['VolvoEndlessAisle_CastingPlayers'].split(',')
    }

    if(this.configService.config['VolvoEndlessAisle_Showroom'] === "true") {
      this.isTablet = true
      this.market = 'en-US'
      this.startInactivityTimer();
    }

    if(this.configService.config['VolvoEndlessAisle_Kista'] === "true") {
      this.isKista = true
    }

    this.fitToWindow();

    this.deliveryAgendaService.getAgendaByRegNumber(this.deliveryAgendaService.selectedRegnum, this.market).subscribe({
      next: (res) => {
        this.deliveryAgendaService.agenda = res;
        this.deliveryAgendaService.currentAgendaIndex = 0;
        this.setUpAgendas();

        const currentState = this.router.lastSuccessfulNavigation;
        if (currentState?.extras['state']) {
          let isQr = currentState?.extras['state']['data']['qr'];

          if (isQr) {
            setTimeout(() => {
              this.swiper.swiperRef.slideTo(this.swiper.swiperRef.slides.length - 1);
              this.deliveryAgendaService.currentAgendaIndex = this.swiper.swiperRef.slides.length - 1;
            }, 50)
          }
        }
        this.cdr.detectChanges();
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  ngOnDestroy() {
    this.stopInactivityTimer();
  }

  mainConfig: SwiperOptions = {
    slidesPerView: 1,
    preventClicksPropagation: true,
    preventClicks: true,
    preventInteractionOnTransition: true,
    threshold: 20,
  };

  setUpAgendas() {
    let temp: any[] = [];

    for (let i = 0; i < this.deliveryAgendaService.agenda.categoryGroups.length; i++) {
      temp.push(this.deliveryAgendaService.agenda.categoryGroups[i]);

      if (!this.configService.config['VolvoEndlessAisle_Showroom'] || this.configService.config['VolvoEndlessAisle_Showroom']?.toString().toLowerCase() == 'false') {
        if (i + 1 == this.deliveryAgendaService.agenda.categoryGroups.length) {
          this.agendas.push(temp);
          temp = [];
        }
      }
      if (this.configService.config['VolvoEndlessAisle_Showroom']?.toString().toLowerCase() == 'true') {
        if (i + 1 == this.deliveryAgendaService.agenda.categoryGroups.length) {
          this.agendas.push(temp);
        }
      }
    }

    this.agendaSteps = Array(this.agendas.length + 1)

    this.loading = false;
    this.cdr.detectChanges();

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.swiper.allowTouchMove = false
    }, 200)
  }

  setQrCodeLink() {
    this.loadingQr = true;
    this.deliveryAgendaService.postAgendaToGrassFeeder(this.deliveryAgendaService.agenda).subscribe({
      next: (res) => {
        if (this.configService.config['VolvoEndlessAisle_Kista']?.toString().toLowerCase() == 'true') {
          console.log('got id for agenda ', res);
          this.qrCodeLink = `${this.linkToMobileSite}?regnum=${res}&retailer=Kista&player=${this.castingService.currentlyCastedPlayer}`;
        }
        else {
          console.log('got id for agenda ', res);
          this.qrCodeLink = `${this.linkToMobileSite}?regnum=${res}`;
        }
        console.log(this.qrCodeLink)
        setTimeout(() => {
          this.loadingQr = false;
          this.cdr.detectChanges();
        }, 500)
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  onBeforeTransitionImage(eventParams: Parameters<SwiperEvents['beforeTransitionStart']>) {

    console.log('SWIPED')

    const [swiper] = eventParams;
    this.deliveryAgendaService.currentAgendaIndex = swiper.activeIndex;
    this.cdr.detectChanges();

    if (swiper.activeIndex > this.agendas.length - 1 && !this.isTablet && !this.isKista) {
      this.header.nativeElement.style.opacity = '0';
      this.next.nativeElement.style.opacity = '0';
      this.point.nativeElement.style.opacity = '0';
      this.setQrCodeLink();
    }
    else if (swiper.activeIndex > this.agendas.length && this.isKista) {
      this.header.nativeElement.style.opacity = '0';
      this.next.nativeElement.style.opacity = '0';
      this.point.nativeElement.style.opacity = '0';
      this.setQrCodeLink();
    }
    else if (swiper.activeIndex > this.agendaSteps.length - 1 && this.isTablet) {
      this.header.nativeElement.style.opacity = '1';
      this.next.nativeElement.style.opacity = '1';
      this.point.nativeElement.style.opacity = '1';
      this.swiper.swiperRef.slideNext(this.swiperSpeed, true)
      this.startSurfaceDelivery();
    }
    else {
      this.header.nativeElement.style.opacity = '1';
      this.next.nativeElement.style.opacity = '1';
      this.point.nativeElement.style.opacity = '1';
    }

  }

  goNext() {
    this.swiper.swiperRef.slideNext(this.swiperSpeed, true)
    
    if(this.configService.config['VolvoEndlessAisle_Showroom'] === "true" && this.deliveryAgendaService.currentAgendaIndex > this.agendaSteps.length - 1) {
      this.setQrCodeLink();
      this.startSurfaceDelivery();
    }
    else if (this.configService.config['VolvoEndlessAisle_Showroom'] === "false" && this.deliveryAgendaService.currentAgendaIndex > this.agendaSteps.length - 1) {
      this.setQrCodeLink();
      this.header.nativeElement.style.opacity = '0';
      this.next.nativeElement.style.opacity = '0';
      this.point.nativeElement.style.opacity = '0';
    }
  }

  goPrev() {
    if (this.deliveryAgendaService.currentAgendaIndex == 0) {

      if(this.castingService.currentlyCastedPlayer != '') {
        this.castingService.cast(this.castingService.currentlyCastedPlayer, '', false).subscribe()
      }

      // Go Back to Pick casting player here
      if(this.HasCasted) { // Casted button pressed, go back to that view
        this.HasCasted = false;
      }
      else { // GO back pressed byt casting has not been pressed. GO back to input order number
        this.router.navigate([PageCard.Delivery]);
      }

    } else {
      this.swiper.swiperRef.slidePrev(this.swiperSpeed, true)
      this.header.nativeElement.style.opacity = '1';
      this.next.nativeElement.style.opacity = '1';
      this.point.nativeElement.style.opacity = '1';
    }
  }

  onContinue() {
    setTimeout(() => {
      this.router.navigate([PageCard.DeliveryMainOverView]);
      this.cdr.detectChanges();
    }, 1000);
  }

  startSurfaceDelivery() {

    setTimeout(() => {
      this.router.navigate([PageCard.DeliveryMainItemViewSurface])
      this.cdr.detectChanges();
    }, 500);
  }

  async SetCastingPlayer(castingPlayerName: string) {
    this.castingService.currentlyCastedPlayer = castingPlayerName;
    await this.castingService.GetPlayer(castingPlayerName);
  }

  Cast() {
    var castingPlayer = this.configService.playerName + ',' + this.deliveryAgendaService.agenda.fdsData.orderDetails.vistaOrderId
    this.castingService.cast(this.castingService.currentlyCastedPlayer, this.deliveryAgendaService.agenda.screenSaverName, true, castingPlayer).subscribe()
    this.goNext();
  }

  setActive(agenda, isParent = false, parent) {

    agenda.show = !agenda.show;

    if (isParent) {
      agenda.categories.forEach(element => {
        element.show = agenda.show
      })
    }

    if (!isParent) {
      parent.show = true;
    }
  }

  exitDelivery() {
    this.router.navigate([PageCard.Delivery]);
  }

  fitToWindow() {
    var doc = document.getElementById('main-container') as HTMLDivElement;
    if (this.configService.config['VolvoEndlessAisle_Kista'] == "true") {
      doc.style.height = '920px'
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
      this.startInactivityTimer();
    }

    setTimeout(() => {
      this.count = 0;
    }, 2000);
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
    console.log("Resetting timer")
    clearTimeout(this.timeoutRef);
    this.timeoutRef = setTimeout(() => {
      console.log('User inactive');
      this.turnOff();
      this.stopInactivityTimer();
    }, this.timeoutDuration);
  };
}
