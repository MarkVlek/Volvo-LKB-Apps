import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { footerGrow } from 'src/app/animations/footer-animation';
import { PageCard } from 'src/app/enums/page-card-enum';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { CartService } from 'src/app/services/cart.service';
import { CastingService } from 'src/app/services/casting.service';
import { ConfigService } from 'src/app/services/config.service';
import { IframeService } from 'src/app/services/iframe.service';
import { LanguageService } from 'src/app/services/language.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SearchBarService } from 'src/app/services/search-bar.service';
import { LanguageDialogComponent } from '../language-dialog/language-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  animations: [ footerGrow ]
})
export class FooterComponent implements OnInit {
  showCasting: boolean = false;
  PageCard = PageCard;
  showBackBtn: any;
  currentPage: string;
  castingPlayer: string = '';
  token: string;
  activeLanguage: string = 'se';
  showroom: Boolean;
  currentLanguage: string = "Swedish";
  atTop: boolean = true;
  atBottom: boolean = false;
  ex60Selected: boolean = false;
  showEX60Button: boolean = false;


  constructor(
    public cartService: CartService,
    private router: Router,
    public searchBarService: SearchBarService,
    public configService: ConfigService,
    private analyticService: AnalyticsService,
    public navigationService: NavigationService,
    public iFrameService: IframeService,
    public castingService: CastingService,
    public languageService: LanguageService,
    public dialog: MatDialog,
    private translate: TranslateService,
  ) { }

      ngOnInit(): void {
      this.showEX60Button = this.configService.ShouldShowEX60();
      console.log("Show EX60 Button: " + this.showEX60Button);
      this.languageService.activeLanguage$.subscribe(lang => {
      this.activeLanguage = lang;
      this.currentLanguage = lang === 'se' ? 'Swedish' : 'English';
      this.translate.use(lang);
    });
    this.languageService.activeCountry$.subscribe(country => {
    });

    this.currentPage = decodeURIComponent(this.navigationService.currentLocationPath[0]);
    this.navigationService.pageChanged$.subscribe(value => {
      this.configService.onlyDelivery = value == "/DeliveryMainItemViewVCS";
      let path = decodeURIComponent(value).split('/').filter(e => e);
      this.currentPage = path[0]
    });
    
    if (this.configService.config['VolvoEndlessAisle_Casting'].toString().toLowerCase() == "true") 
      this.checkCasting();
    
    this.checkShowroom()
    
    this.navigationService.pageCardClicked$.subscribe(value => {
      this.ex60Selected = (value === PageCard.EX60);
    });

    this.checkCurrentRoute();
  }

  ngAfterViewInit() { }

  refresh() {
    this.analyticService.postEventToAnalytics("Start over","Start over",'EndlessAisle', 1);
    window.location.reload();
  }


  toggleBack(){
    return this.iFrameService.getBackBtn();
  }

  toggleSearch() {
    this.searchBarService.onSearchBar$.next(!this.searchBarService.searchBarActive);
  }


  goToCart() {
    this.router.navigate([PageCard.Cart]);
  }

  checkCasting() {
    let configPlayer = this.configService.config["VolvoEndlessAisle_CastingPlayers"]
    this.castingService.GetCastingPlayer(configPlayer).subscribe(player => {
      if (player) this.castingPlayer = player["key"];
      console.log(this.castingPlayer)
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LanguageDialogComponent, {
      panelClass: 'language-picker-dialog',
      data: { language: this.activeLanguage }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.activeLanguage = result;
    })
  }

  checkShowroom() {
    if (this.configService.config["VolvoEndlessAisle_Showroom"]?.toString().toLowerCase() == "true") {
      this.showroom = true
    }
    else {
      this.showroom = false
    }
  }

  changeLanguage() {
    console.log(this.activeLanguage)
    if (this.activeLanguage == "se") {
      this.translate.use('en')
      this.activeLanguage = "en"
      this.languageService.setActiveLanguage(this.activeLanguage)
      this.currentLanguage = "English"
      this.iFrameService.setEvent('language')
    }
    else {
      this.activeLanguage = "se"
      this.translate.use('se')
      this.languageService.setActiveLanguage(this.activeLanguage)
      this.currentLanguage = "Swedish"
      this.iFrameService.setEvent('language')
    }
  }
  checkCurrentRoute() {
    const currentUrl = this.router.url;
    this.ex60Selected = currentUrl.includes('EX60') || currentUrl === '/EX60';
  }
  gotoPage() {
    // Navigate to Leveransklara Bilar
    this.navigationService.pageCardClicked$.next(PageCard.EX60);
    this.router.navigate([PageCard.EX60], { skipLocationChange: true });
    
    }
    shouldShowInFooter(page: PageCard): boolean {
      // Hide LaunchIframe from footer when showroom is true
      if (this.showroom && page === PageCard.LaunchIframe) {
        return false;
      }
      return true;
    }

}
