import { Component, OnInit, ViewChild } from '@angular/core';
import { routeTransitionAnimations } from './animations/route-transition-animations';
import { LkbService } from './services/lkb.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet>
              <div class="header">
                <div class="header-main">
                  <div class="logo-container">
                    <img class="logo" src="./assets/images/volvologo.svg">
                  </div>
                </div>
              </div>
            </router-outlet>
            <app-back></app-back>`,
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
export class AppComponent implements OnInit {
  constructor(
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
}
