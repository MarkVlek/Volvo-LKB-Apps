import { Component, ViewChildren } from '@angular/core';
import { BaseIframeComponent } from '../base-iframe/base-iframe.component';
import { IframeKeyBoardService } from 'src/app/services/Iframe-keyboard.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { ConfigService } from 'src/app/services/config.service';
import { IframeService } from 'src/app/services/iframe.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { InteractionTrackingService } from 'src/app/services/Statistics/interaction-tracker.service';
import { URL_TO_NODE } from '../../../constants';


@Component({
  selector: 'app-offers-iframe',
  templateUrl: './offers-iframe.component.html',
  styleUrls: ['./offers-iframe.component.scss']
})
export class OffersIframeComponent extends BaseIframeComponent {
  @ViewChildren('IFrame') iframe!: HTMLIFrameElement;
  url$: string = '';
  dealerId: string;
  currentPath: string;
  urlStack: string[] = [];
  lastUrl: string;
  urlChecker: any;
  running: any;

  constructor(
    keyBoardService: IframeKeyBoardService,
    screenSaverTimer: ScreenSaverTimerService,
    configService: ConfigService,
    public IFrameService: IframeService,
    private navigationService: NavigationService, 
    protected override interactionTracker: InteractionTrackingService
  ) { super(configService, screenSaverTimer, keyBoardService, interactionTracker) }
  
  CalledOnInit() {
    this.dealerId = this.configService.GetDealerID();
    this.url$ = this.configService.GetOffersUrl(this.dealerId);
    this.IFrameService.getEvent().subscribe(event => {
      if (this.currentPath !== "Erbjudanden") return;
      if (event == 'back') this.back()
    })
  }
  
  CalledAfterViewInit() {
    this.navigationService.pageChanged$.subscribe(value => {
      let path = decodeURIComponent(value).split('/').filter(e => e);
      this.currentPath = path[0]
      if (this.currentPath == "Erbjudanden") {
        this.checkUrlChange();
      }
      else {
        this.stopTick();
        this.IFrameService.setBackBtn('false')
      }
    });
  }

  ngOnDestroy() { }

  CalledIFramClickHandeler() { }

  CalledIFrameFocusHandler() { }

  override onSetUp(doc: Document) { }

  back() {
    const prev = this.urlStack.pop();
    if (prev) this.iframe["first"].nativeElement.contentWindow.location.replace(prev);
  }

  checkUrlChange() {
    if (this.running) return;
    this.running = true;

    const iframe = this.iframe["first"].nativeElement;

    const tick = () => {
      try {
        const currentLocation = iframe.contentWindow.location.href;
        if (currentLocation !== this.lastUrl) {
          this.urlStack.push(this.lastUrl);
          this.lastUrl = currentLocation;
        }
        if (this.checkUrl(currentLocation))
          this.IFrameService.setBackBtn('true')
        else
          this.IFrameService.setBackBtn('false')
      } catch (e) {

      } finally {
        if (this.running) this.urlChecker = requestAnimationFrame(tick)
      }
    };
    this.urlChecker = requestAnimationFrame(tick);
  }

  stopTick() {
    this.running = false;
    if(this.urlChecker) cancelAnimationFrame(this.urlChecker);
  }

  checkUrl(url: string): boolean {
    switch (url) {
      case URL_TO_NODE + `/offers/instore/?branchCode=${this.dealerId}`:
        return false
      case URL_TO_NODE + `/offers/instore/?branchCode=${this.dealerId}#/`:
        return false;
      default:
        return true;
    }
  }
}