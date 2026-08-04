import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { routeTransitionAnimations } from './animations/route-transition-animations';
import { LkbService } from './services/lkb.service';

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
  ) { }

  ngOnInit(): void {
    // Pre-fetch the full inventory on startup so it's cached
    // before the user reaches the list screen
    const loader = (window as any).Loader;
    if (loader) {
      loader.isStarted().then(() => {
        this.lkbService.initializeCars();
      });
    } else {
      this.lkbService.initializeCars();
    }
  };

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
