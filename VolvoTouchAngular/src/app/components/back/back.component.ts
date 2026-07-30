import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'rxjs';
import { fadeAnimation } from 'src/app/animations/simple-fade.animation';
import { PageCard } from 'src/app/enums/page-card-enum';
import { ConfigService } from 'src/app/services/config.service';
import { IframeService } from 'src/app/services/iframe.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SearchBarService } from 'src/app/services/search-bar.service';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.scss'],
  animations: [fadeAnimation]
})
export class BackComponent implements OnInit {
  canRefresh: boolean = false;
  canGoBack: boolean = false;
  currentPath: string = "";
  page: string;
  showBackBtn: boolean;
  showRefresh: boolean = false;

  constructor(
    public searchBarService: SearchBarService,
    public navigationService: NavigationService,
    public configService: ConfigService,
    public iFrameService: IframeService) { }

  ngOnInit(): void {
    this.iFrameService.getBackBtn().subscribe(event => {
    if (event == 'true') this.navigationService.iframeBackBtn = true;
    else if (event == 'false') this.navigationService.iframeBackBtn = false;
  })
    this.iFrameService.getRefresh().subscribe(event => {
      if (event == 'true') this.navigationService.iframeRefresh = true;
      else if (event == 'false') this.navigationService.iframeRefresh = false;
    })
    this.navigationService.pageChanged$.subscribe(value => {
      let path = decodeURIComponent(value).split('/').filter(e => e);
      this.currentPath = path[0];
      this.page = path[1];
      
      if (this.isShowroomConfigActive()) {
        // if (this.currentPath == "EX60" || this.currentPath == PageCard.LaunchIframe) {
        //   this.navigationService.showBackButton = true;
        //   return;
        // }
        const pages = new Set(["Digital Services & Infotainment", "Safety Systems", "Digitala Tjänster & Infotainment", "Säkerhetssystem"])
        if (pages.has(this.page)) {
          this.navigationService.showBackButton = true;
          this.canGoBack = true;
        }
        else if (this.currentPath == PageCard.RTCItemList || this.currentPath == PageCard.RTCItemView) {
          this.navigationService.showBackButton = true;
          this.canGoBack = true;
        }
        else
          this.navigationService.showBackButton = false;
      } 

      else if(this.isReasonToChooseConfigActive()){
        if(this.page === "Tillbehör" || this.page === "Innovationer" || this.page === "Tjänster"){
          this.navigationService.showBackButton = path.length > 2;
          return;
        }
        if(this.currentPath === PageCard.RTCCategoryList && this.page === "Privat" || this.page === "Företag"){
          this.navigationService.showBackButton = true;
          this.canGoBack = true;
          return;
        }
        switch (this.currentPath) {
          case PageCard.RTCItemList:
          case PageCard.RTCItemView:
          case PageCard.AccessoriesCategory:
          case PageCard.AccessoriesCategoryDetails:
          case PageCard.AccessoriesProduct:
          case PageCard.Leveransklara_bilarcategory:
          case PageCard.Leveransklara_bilar_detail:
          case PageCard.ElectrificationCategories:
          case PageCard.ElectrificationItemView:
          case PageCard.LaunchIframe:
            this.navigationService.showBackButton = true;
            break;
          default:
            this.navigationService.showBackButton = false;
            break;
        }
      }    

    });
  }

  OnBack() {
    this.navigationService.back();
  }

  reloadIframe() {
    this.iFrameService.setEvent('reload')
  }

  backIframe() {
    this.iFrameService.setEvent('back')
  }

  private isShowroomConfigActive(): boolean {
    return this.configService.config["VolvoEndlessAisle_Showroom"]?.toString().toLowerCase() === "true";
  }
  
  private isReasonToChooseConfigActive(): boolean {
    return this.configService.config["VolvoEndlessAisle_ReasonToChoose"]?.toString().toLowerCase() === "true" || this.configService.config["VolvoEndlessAisle_LeveransklaraBilar"]?.toString().toLowerCase() === "true" || this.configService.config["VolvoEndlessAisle_ChooseAccesories"]?.toString().toLowerCase() === "true";
  }

}

