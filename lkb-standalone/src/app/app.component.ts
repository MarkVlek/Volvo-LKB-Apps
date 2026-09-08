import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { routeTransitionAnimations } from './animations/route-transition-animations';
import { LKB_ROUTES } from './app-routing.module';
import { LkbService } from './services/lkb.service';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  template: `<div class="main-canvas">
              <div class="header">
                <div class="header-main">
                  <div class="logo-container">
                    <img class="logo" src="./assets/images/volvologo.svg">
                  </div>
                </div>
              </div>
              <div [@routerTrigger]="prepareRoute(outlet)">
                <router-outlet #outlet="outlet"></router-outlet>
              </div>
              <app-back></app-back>
            </div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .header-main {
      width: 100%;
      height: 63px;
      z-index: 20000;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      background-color:var(--header-color);
    }
    .header-main .logo-container {
      width: 106px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .header-main .logo-container img{
      min-width: 100%;
      min-height: 10px;
      max-width: 10px;
      max-height: 100%;
      object-fit: contain;
    }
  `],
  animations: [routeTransitionAnimations]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(RouterOutlet, { static: false }) outlet: RouterOutlet;
  routerAnimation: string;

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private lkbService: LkbService,
    private analytics: AnalyticsService,
  ) { }

  ngOnInit(): void {
    // Pre-fetch the full inventory on startup so it's cached
    // before the user reaches the list screen
    const loader = (window as any).Loader;
    if (loader) {
      loader.isStarted().then(() => {
        this.analytics.track(false, 'Session', 'Session started');
        this.lkbService.initializeCars();
      });
    } else {
      this.analytics.track(false, 'Session', 'Session started');
      this.lkbService.initializeCars();
    }

    this.analytics.sessionEnded$.subscribe(() => this.resetToStartScreen());
  };

  /**
   * A visitor who walks away leaves the screen on their own car; the next one should find the start
   * screen. The list and its filters are rebuilt from scratch on re-entry (the reuse strategy only
   * re-attaches the cached list when returning from a car's detail page), so only the state held on
   * LkbService has to be cleared by hand.
   */
  private resetToStartScreen(): void {
    this.lkbService.selectedCar = null;
    this.lkbService.sideBar = true;
    this.router.navigate([LKB_ROUTES.CATEGORIES]);
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
  }

  prepareRoute(outlet?: RouterOutlet) {
    return outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animationState'];
  }
}
