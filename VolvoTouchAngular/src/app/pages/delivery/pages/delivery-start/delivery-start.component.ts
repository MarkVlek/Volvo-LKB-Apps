import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { DeliveryAgendaService } from '../../services/delivery-agenda.service';
import { DELIVERYIMAGESSCREENSAVERVDRE, SSCREENSAVERVDRE } from '../../models/deliveryconst';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { StatisticService } from 'src/app/services/Statistics/statistics.service';

@Component({
  selector: 'app-delivery-start',
  templateUrl: './delivery-start.component.html',
  styleUrls: ['./delivery-start.component.scss']
})
export class DeliveryStartComponent implements OnInit {
  
  videoUrl:string = '';
  loading: boolean = true;
  isVCS:boolean = false;
  public pageChange$: Subscription;
  currentNav: string[] = [];
  defaultMode: boolean = false

  constructor(
    private router: Router, 
    public deliveryAgendaService: DeliveryAgendaService, 
    private configService: ConfigService, 
    private navigationService: NavigationService, 
    private screenSaverTimerService: ScreenSaverTimerService,
    private statisticsService: StatisticService) {
  
    this.pageChange$ = this.navigationService.pageChanged$.subscribe(value => {
      
      this.currentNav = decodeURIComponent(value).split('/').filter(e => e);
     
      if(this.currentNav.includes("noreg")) {
        this.defaultMode = true
      }

    });

  }

  ngOnInit(): void {

    this.isVCS = this.configService.config['VolvoEndlessAisle_Showroom'] !== 'true' || this.configService.config['VolvoEndlessAisle_ByggDinVolvo'] === 'true';
    if(this.defaultMode) {
      this.loading = false

      console.log("VÄlkomsbudskap is: " + this.deliveryAgendaService.agenda.carModel)

      if(this.deliveryAgendaService.agenda.carModel == "Generic") {
        this.videoUrl = `${SSCREENSAVERVDRE}/${this.deliveryAgendaService.agenda.screenSaverName}`;

      } else {
        this.videoUrl = `${DELIVERYIMAGESSCREENSAVERVDRE}/${this.deliveryAgendaService.agenda.screenSaverName}`;
      }
      
      setTimeout(() => {
        document.getElementById('text-container').classList.add('fade');
      }, 2000)
    }
    else {

      this.deliveryAgendaService.getAgendaByRegNumber(this.deliveryAgendaService.selectedRegnum).subscribe({
        next: (res) => {
          // Do the custom agenda mapping here, fetch only highlighted features
          this.deliveryAgendaService.agenda = res;
          this.videoUrl = `${DELIVERYIMAGESSCREENSAVERVDRE}/${this.deliveryAgendaService.agenda.screenSaverName}`;
          this.loading = false;
          if(this.deliveryAgendaService.agenda.categories.length == 0) {
            this.defaultMode = true
            this.isVCS = true
          }

        },error: (err) => {
          console.log(err);
        }
      })
      setTimeout(() => {
        document.getElementById('text-container').classList.add('fade');
      }, 2000)

    }

  }

  onStart() {
    // End Delivery session and start DeliveryFeatures session when proceeding to features
    this.transitionToFeatures();

    if(this.configService.config['VolvoEndlessAisle_Showroom'] !== 'true' && this.configService.config['VolvoEndlessAisle_Kista'] !== 'true') {
      setTimeout(() => {
      this.router.navigate([PageCard.DeliveryMainItemViewvcs])
    },300)
    }
    else {
  
      setTimeout(() => {
        this.router.navigate([PageCard.DeliveryChooseAgenda])
      },300)

    }
  }

  finish() {
    this.screenSaverTimerService.startTimer()
    this.router.navigate([PageCard.Delivery]);
  }

  transitionToFeatures() {
    // End Delivery welcome screen session
    if (this.statisticsService.currentStatistic && this.statisticsService.currentStatistic.App === 'Delivery') {
      this.statisticsService.endAndPostCurrentSession(true, 2);
    }
    
    // Start DeliveryFeatures session
    this.statisticsService.currentStatistic = {
      DisplayPrefix: this.configService.playerName,
      App: 'DeliveryFeatures',
      Dealer: this.configService.GetDealerID(),
      StartOfSession: new Date(),
      SessionLengthInSec: 0
    };
    this.statisticsService.startSession();
  }
}
