import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fadeAnimation } from 'src/app/animations/simple-fade.animation';
import { EnergySaverService } from 'src/app/services/energy-saver.service';
import { PageCard } from 'src/app/enums/page-card-enum';
import { ConfigService } from 'src/app/services/config.service';
import { IFrameHandler, IframeService } from 'src/app/services/iframe.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { StatisticService } from 'src/app/services/Statistics/statistics.service';

@Component({
  selector: 'app-page-card',
  templateUrl: './page-card.component.html',
  styleUrls: ['./page-card.component.scss'],
  animations: [fadeAnimation]
})
export class PageCardComponent implements OnInit {
  @Input() page: PageCard;
  @ViewChild('title') title!: ElementRef<HTMLElement>;
  @ViewChild('pageCardMain') pageCard!: ElementRef<HTMLElement>
  selected: boolean = false;

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private statisticsService: StatisticService,
    private iframeService: IframeService,
    private configService: ConfigService,
    private energySaverService: EnergySaverService) { }


  ngOnInit(): void {

    this.navigationService.pageCardClicked$.subscribe(value => {

      if ((value == this.page)) {
        this.pageCard.nativeElement.style.pointerEvents = "none"
        this.selected = true;
      }
      else {
        this.selected = false;
        this.pageCard.nativeElement.style.pointerEvents = "auto"
      }

    })

  }

  ngAfterViewInit() {
    if (this.page == "EX60") {
      this.title.nativeElement.classList.add("launch-title-wov");
    }
  }

  pageIsRtc(input: PageCard): boolean {

    if (input == PageCard.Tjänster || input == PageCard.Innovationer || input == PageCard.Launch) {
      return true;
    }
    return false;
  }

  initStatisticSession() {
    if (this.energySaverService.isActive) {
      console.log('Energy saver active - skipping statistic');
      return;
    }
    
    // Skip session creation for Delivery - it handles its own statistics
    if (this.page === PageCard.Delivery) {
      // End any active delivery session if navigating back to Delivery search page
      this.statisticsService.endAndPostCurrentSession(true);
      return;
    }
    
    // End current session before starting new one
    this.statisticsService.endAndPostCurrentSession();

    // Initialize new session
    this.statisticsService.currentStatistic = {
      DisplayPrefix: this.configService.playerName,
      App: this.page,
      Dealer: this.configService.GetDealerID(),
      StartOfSession: new Date(),
      SessionLengthInSec: 0,
    };

    this.statisticsService.startSession();
  }

  gotoPage() {

    this.initStatisticSession();

    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.ElectrificationIframe, false));
  
    this.navigationService.pageCardClicked$.next(this.page);

    if (this.pageIsRtc(this.page)) {
      this.router.navigate([PageCard.RTCCategoryList, this.page])
    }
    else {
      this.router.navigate([this.page], { skipLocationChange: true });
    }

  }
}
