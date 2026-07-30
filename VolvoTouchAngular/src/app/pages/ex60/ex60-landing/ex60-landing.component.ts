import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { Ex60Category, Ex60Service } from 'src/app/services/ex60.service';
import { StatisticService } from 'src/app/services/Statistics/statistics.service';

@Component({
  selector: 'app-ex60-landing',
  templateUrl: './ex60-landing.component.html',
  styleUrls: ['./ex60-landing.component.scss']
})
export class Ex60LandingComponent implements OnInit {
  @ViewChild('Nya', { static: false }) selektBox: ElementRef;
  showBackButton = false;
  headline: string;
  categoryName: string;
  categories: Ex60Category[];
  funktionerLoading: boolean = false;
  elektrifieringLoading: boolean = false;
  leasingLoading: boolean = false;
  appLoading: boolean = false;

  constructor(
    private ex60Service: Ex60Service,
    private router: Router,
    public configService: ConfigService,
    public dialog: MatDialog,
  private statisticsService: StatisticService) { }

  ngOnInit(): void {
    this.initStatisticSession();
    this.headline = 'Volvo EX60';
    this.categories = this.ex60Service.getCategoryTypes();
    
    // Filter out elektrifiering if showroom is not true
    if (this.configService.config['VolvoEndlessAisle_Showroom']?.toString().toLowerCase() !== 'true') {
      this.categories = this.categories.filter(cat => cat.id !== 'elektrifiering');
    }
    
    this.resetLoadingStates();
  }

  initStatisticSession() {
    this.statisticsService.endSession();
    
    if (this.statisticsService.currentStatistic) {
      this.statisticsService.currentStatistic.SessionLengthInSec = this.statisticsService.getSessionLengthInSec();
      this.statisticsService.currentStatistics.push(this.statisticsService.currentStatistic);
    }

    this.statisticsService.currentStatistic = {
      DisplayPrefix: this.configService.playerName,
      App: 'EX60Landing',
      Dealer: this.configService.GetDealerID(),
      StartOfSession: new Date(),
      SessionLengthInSec: 0,
    };

    this.statisticsService.startSession();
  }

  private resetLoadingStates() {
    this.funktionerLoading = false;
    this.elektrifieringLoading = false;
    this.leasingLoading = false;
    this.appLoading = false;
  }

  setWaitToCorrectCategory(category: Ex60Category) {
    this.resetLoadingStates();
    
    switch (category.name) {
      case "Funktioner":
        this.funktionerLoading = true;
        break;
      case "Elektrifiering":
        this.elektrifieringLoading = true;
        break;
      case "Leasing":
        this.leasingLoading = true;
        break;
      case "App":
        this.appLoading = true;
        break;
    }
  }
}