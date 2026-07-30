import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { routeTransitionAnimations } from './animations/route-transition-animations';
import { ContinueModalComponent } from './modals/continue-modal/continue-modal.component';
import { ConfigService } from './services/config.service';
import { IframeService } from './services/iframe.service';
import { ScreenSaverTimerService } from './services/screen-saver-timer.service';
import { SearchBarService } from './services/search-bar.service';
import { ScreensaverService } from './services/screen-saver.service';
import { triggerSearchBar } from './animations/search-bar.animation';
import { PageCard } from './enums/page-card-enum';
import { triggerSamePageRouting } from './animations/route-to-same-page.animations';
import { NavigationService } from './services/navigation.service';
import { StatisticService } from './services/Statistics/statistics.service';
import { ConfigErrorService } from './services/config-error-timer.service';

import { BackendService } from './services/backend.service';
import { ImagePreloadService } from './services/image-preload.service';
import { RTCService } from './services/rtc.service';
import { AdminComponent } from './components/admin/admin.component';
import { SalesPersonService } from './components/sales-person/services/sales-selector.service';
import { EnergySaverComponent } from './energy-saver/energy-saver.component';
import { AccessoriesService } from './services/accessories.service';

import CarModelsService from './services/carmodels.service';
import { LkbService } from './services/lkb.service';
import { Subscription } from 'rxjs';
import { CastingService } from './services/casting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransitionAnimations, triggerSearchBar, triggerSamePageRouting]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(RouterOutlet, { static: false }) outlet: RouterOutlet;
  @ViewChild('screensaver') videoRef?: ElementRef<HTMLVideoElement>;
  routerAnimation: string;

  title = 'VolvoFrontend';
  fetchedConfig: boolean = false;
  showBdvIframe: boolean = false;
  screenSaverOn: boolean = false;
  showCareByVolvoIframe: boolean = false;
  showErrorMsg: boolean;
  isDelivery: boolean = false;
  touchTime: number;
  isExplorer: string;
  hiddenButton: string = '0%';
  showHeader: boolean = false;
  private screenSaverTimerSubscription: Subscription;
  private dialogSubscription: Subscription;

  timeoutHandler: any;
  count: number = 0;

  constructor(
    public configService: ConfigService,
    private router: Router,
    private screenSaverTimerService: ScreenSaverTimerService,
    public iframeService: IframeService,
    public dialog: MatDialog,
    public searchBarServic: SearchBarService,
    public screenSaverService: ScreensaverService,
    private navigationService: NavigationService,
    private statisticsService: StatisticService,
    private configerrorService: ConfigErrorService,
    private changeDetectorRef: ChangeDetectorRef,
    private backendService: BackendService,
    private imagePreloaderService: ImagePreloadService,
    private rtcService: RTCService,
    public salesPersonService: SalesPersonService,
    private accessoriesService: AccessoriesService,
    private carModelService: CarModelsService,
    private lkbService: LkbService,
    private castingService: CastingService
  ) {

  }

  @HostListener('document:click', ['$event'])
  handlerFunction(e: MouseEvent) {
    if (this.configService.screenSaverOn) {
      this.screenSaverTimerService.resetTimer();
    }
  }

  async ngOnInit(): Promise<void> {

    this.configerrorService.startTimer();
    this.configerrorService.onComplete.subscribe(() => { this.showErrorMsg = true; })

    await this.configService.SetConfig().then(() => {
      if (this.configService.onlyElectrification) {
        this.fetchedConfig = true;
        this.router.navigate([PageCard.ElectrificationOnly]);
        setTimeout(() => {
          this.navigationService.pageCardClicked$.next(PageCard.ElectrificationOnly.toString())
        }, 20);
      } else if (this.configService.onlyDelivery) {
        this.fetchedConfig = true;
        this.router.navigate([PageCard.Delivery]);
        setTimeout(() => {
          this.navigationService.pageCardClicked$.next(PageCard.Delivery.toString())
        }, 20);
      }
      else {
        this.StartPageExists();
      }
    });

    this.checkIfExplorer();
    this.CachImages();

    if (this.configService.screenSaverOn) {
      this.screenSaverService.initiateScreensavers();
      this.StartScreenSaverTimer();
    };

    if (this.configService.lkb) {
      this.lkbService.initializeCars();
    }

    this.checkCurrentPage();
    this.iframeService.loadStyles();
  }

  ngAfterViewInit(): void {
    // This change will ensure that change detection runs after the view is initialized, preventing the ExpressionChangedAfterItHasBeenCheckedError from occurring.
    this.changeDetectorRef.detectChanges();
    Promise.resolve().then(() => {
      this.routerAnimation = this.prepareRoute(this.outlet);
      this.changeDetectorRef.detectChanges();
    });


    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.routerAnimation = this.prepareRoute(this.outlet);
        this.changeDetectorRef.detectChanges();
      }
    });

    this.iframeService.currentIFrame$.subscribe(value => {
      this.iframeService.currentIFrame = value;
      this.changeDetectorRef.detectChanges();
    })

    // this.screenSaverService.screenSaverState.subscribe(res => {
    //   this.screenSaverOn = res;
    // });
  }

  prepareRoute(outlet?: RouterOutlet) {
    return outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animationState'];
  }

  private StartScreenSaverTimer() {
    this.screenSaverTimerService.startTimer(true);

    // Unsubscribe from previous subscription if it exists
    if (this.screenSaverTimerSubscription) {
      this.screenSaverTimerSubscription.unsubscribe();
    }
    
    this.screenSaverTimerSubscription = this.screenSaverTimerService.onComplete.subscribe(() => {
      var dialogRef = this.dialog.open(ContinueModalComponent, {
        width: '440px',
        panelClass: 'continue-modal',
        disableClose: true
      });

      if (this.dialogSubscription) {
        this.dialogSubscription.unsubscribe();
      }

      this.dialogSubscription = dialogRef.afterClosed().subscribe(startScreenSaver => {
        this.finishUpStatistic();
        
        if (startScreenSaver) {
          this.showScreensaver();
        }
        
        if (this.dialogSubscription) {
          this.dialogSubscription.unsubscribe();
          this.dialogSubscription = null;
        }
      });
    });
  }

  showScreensaver() {
    this.screenSaverService.showScreensaver = true;
    
    if (this.castingService.isCasting === true) {
      this.castingService.castBdv(this.castingService.currentlyCastedPlayer, "", "").subscribe();
      this.castingService.isCasting = false;
    }
    // Reload all iframes when entering screensaver
    this.iframeService.setEvent('reload');
    
    requestAnimationFrame(() => {
      const video = this.videoRef.nativeElement;
      video.src = this.screenSaverService.screenSaver.fileName;
      video.muted = true;
      video.play().catch(err => console.warn('Autoplay blocked:', err));

      this.screenSaverService.startVideoRecreation();
    });
  }

  finishUpStatistic(activelyClicked: boolean = false) {

    if(this.statisticsService.currentStatistic != undefined) {
      // Apply time adjustment for screensaver delay if not actively clicked
      if(!activelyClicked) {
        this.statisticsService.endSession();
        this.statisticsService.currentStatistic.SessionLengthInSec = this.statisticsService.getSessionLengthInSec() - 5;
        this.statisticsService.currentStatistic.InteractionCount = this.statisticsService.getCurrentInteractionCount();
        
        // Manually post since we adjusted the time
        if(this.statisticsService.currentStatistic.App === 'DeliveryFeatures' || 
           this.statisticsService.currentStatistic.App === 'Delivery' ||
           this.statisticsService.currentStatistic.InteractionCount > 0) {
          this.statisticsService.currentStatistics.push(this.statisticsService.currentStatistic);
          this.statisticsService.postStatistic();
        }
        this.statisticsService.currentStatistic = null;
      } else {
        this.statisticsService.endAndPostCurrentSession();
      }
    }

  }

  private async StartPageExists() {
    setTimeout(() => {
      this.fetchedConfig = true;
      this.configerrorService.subscription$.unsubscribe();
      if (!!this.configService.startPage) {
        this.router.navigate([this.configService.startPage]);
        setTimeout(() => {
          this.navigationService.pageCardClicked$.next(this.configService.startPage.toString())
          this.navigationService.pageChanged$.next(this.configService.startPage.toString())
        }, 20);
      }
      else {
        let page: PageCard = this.configService.pages[0]
        this.router.navigate([page]);
        setTimeout(() => {
          this.navigationService.pageCardClicked$.next(page.toString())
        }, 20);
      }
    }, 4000);

  }

  reload() {
    this.StartPageExists();
    window.location.reload();
  }

  private async CachImages() {

    if (this.configService.pages.includes(PageCard.Environment)) {
      this.backendService.getEnvironments().subscribe((env) => {
        env.forEach((environment, index) => {
          const alias = `Environment-${index}`; // Create an alias for each image'
          this.imagePreloaderService.preloadImage(alias, environment.fileName);
        });
      });
    };

    if (this.configService.pages.includes(PageCard.Sök_Tillbehör)) {
      setTimeout(() => {
        this.preloadAccessoryImages("Accessories");
      }, 2000);
    }


    if (this.configService.pages.includes(PageCard.Tjänster || PageCard.Innovationer || PageCard.Launch)) {
      setTimeout(() => {
        this.preloadCategoryImages("Innovationer");
        this.preloadCategoryImages("Tjänster");
        this.preloadCategoryImages("Privat");
        this.preloadCategoryImages("Företag");
        this.preloadCategoryImages("Launchevent");
      }, 2000);
    }

    if (this.configService.config["VolvoEndlessAisle_Showroom"]?.toString().toLowerCase() == "true") {
      setTimeout(() => {
        this.preloadFeatureCategoryImages("Innovationer");
        this.preloadFeatureCategoryImages("Digital Services & Infotainment");
        this.preloadFeatureCategoryImages("Digitala Tjänster & Infotainment");
        this.preloadFeatureCategoryImages("Safety Systems");
        this.preloadFeatureCategoryImages("Säkerhetssystem");
      }, 2000);
    }

  }

  preloadAccessoryImages(accessory) {
    this.accessoriesService.getCategories().subscribe(cl => {
      cl.forEach((c) => {

        const imageKey = accessory + c.name;
        const imageUrl = c.media.filePath;
        this.imagePreloaderService.preloadImage(imageKey, imageUrl);
        
        c.accessories.forEach(a => {
          const imageKey = accessory + a.id;
          const imageUrl = a.medias.at(0).filePath;
          this.imagePreloaderService.preloadImage(imageKey, imageUrl);
          
        })

      })
    })

    this.carModelService.carModels.forEach(x => {
      const imageKey = accessory + x.displayTitle;
      const imageUrl = x.img;
      this.imagePreloaderService.preloadImage(imageKey, imageUrl);
    })

  }

  preloadCategoryImages(categoryName) {
      const categoryList = this.rtcService.getCategoryList(categoryName);
      
      if (categoryList && categoryList.categories) {
        categoryList.categories.forEach((c, index) => {
          const imageKey = categoryName + index;
          const imageUrl = c.hero_image ?? c.thumbnail
          this.imagePreloaderService.preloadImage(imageKey, imageUrl);
        });
      } else {
        console.warn(`Category '${categoryName}' not found`);
      }
    }
    preloadFeatureCategoryImages(categoryName) {
      const categoryList = this.rtcService.getFeatureCategoryList(categoryName);
      
      if (categoryList && categoryList.categories) {
        categoryList.categories.forEach((c, index) => {
          const imageKey = categoryName + index;
          const imageUrl = c.hero_image ?? c.thumbnail;
          this.imagePreloaderService.preloadImage(imageKey, imageUrl);
        });
      } else {
        console.warn(`Category '${categoryName}' not found in feature categories`);
      }
    }

  mouseup() {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }
  
  mousedown() {
    this.count += 1;
    if (this.count >= 3) {
      const dialogRef = this.dialog.open(AdminComponent, { disableClose: true });
      dialogRef.afterClosed().subscribe({
        next:(data) => {
          if(data)
            location.reload();
        }
      })
    }
    setTimeout(() => {
      this.count = 0;
    }, 2000);
  }

  click(type) {

    if (this.touchTime === 0) {
      this.touchTime = new Date().getTime();
    } else {
      if (new Date().getTime() - this.touchTime < 400) {
        if (type === 'saleslist')
          this.salesPersonService.isShowing = true;
      } else {
        this.touchTime = new Date().getTime();
      }
    }
  }

  checkIfExplorer () {
    this.isExplorer = this.configService.config["VolvoEndlessAisle_Explorer"]?.toString().toLowerCase();
    
    if (this.isExplorer == 'true') {
      this.hiddenButton = '98%'
    }
  }

  checkCurrentPage() {
    var paths = ['Bygg din Volvo', 'Erbjudanden', 'Test Drive', 'Our Cars', 'Shop']
    this.navigationService.pageChanged$.subscribe(value => {
      let path = decodeURIComponent(value).split('/').filter(e => e);
      let currentPath = path[0]

      if(paths.includes(currentPath)) this.showHeader = false;
      else this.showHeader = true;
    });
  }
}
