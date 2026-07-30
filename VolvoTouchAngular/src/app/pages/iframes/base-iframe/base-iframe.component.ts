import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { IframeKeyBoardService } from 'src/app/services/Iframe-keyboard.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { IBaseFrame } from './baseframe.interface';
import { InteractionTrackingService } from 'src/app/services/Statistics/interaction-tracker.service';

@Component({
  selector: 'app-base-iframe',
  templateUrl: './base-iframe.component.html',
})
export abstract class BaseIframeComponent implements OnInit, AfterViewInit, IBaseFrame {
  @ViewChild('keyboardContainer', { static: false })
  keyboardContainer?: ElementRef<HTMLElement>;

  // Properties
  public showKeyboard: boolean = false;

  // Protected
  protected configService: ConfigService;
  protected screensaverTimerService: ScreenSaverTimerService;
  protected keyboardService: IframeKeyBoardService
  protected interactionTracker: InteractionTrackingService;


  // Getters
  get onScreensaver(): boolean {
    return this.configService.SetScreensaverOn ? true : false
  }

  // Constructor
  constructor(configService: ConfigService, screensaverTimerService: ScreenSaverTimerService, keyboardService: IframeKeyBoardService, interactionTracker: InteractionTrackingService) {
    this.configService = configService;
    this.screensaverTimerService = screensaverTimerService;
    this.keyboardService = keyboardService
    this.interactionTracker = interactionTracker;
  }

  ngOnInit(): void {
    this.showKeyboard = false;
    this.CalledOnInit();
  }

  ngAfterViewInit(): void {
    this.CalledAfterViewInit();
  }

  // External
  onIframeLoaded(iframe: HTMLIFrameElement) {
    if (!iframe.src) return;

    const bdvDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (bdvDoc) {
      this.onSetUp(bdvDoc)
      bdvDoc.addEventListener('click', this.iFrameClickHandler.bind(this), false);
      bdvDoc.addEventListener('focusin', this.iFrameFocusHandler.bind(this), false);
    }
  }

  iFrameClickHandler() {
    this.CalledIFramClickHandeler();
    
    this.interactionTracker['interactionCount']++;
    
    if (this.onScreensaver) this.screensaverTimerService.resetTimer();
  }

  iFrameFocusHandler(event: FocusEvent) {
    this.CalledIFrameFocusHandler();
    if (this.isInput(event)) {
      this.keyboardService.currentFocusEvent$.next(event);
      this.keyboardService.showKeyboard = true;
    }
  }

  isInput(event: any): boolean {
    const validTagNames = ['INPUT', 'TEXTAREA'];
    const validTypes = ['text', 'email', 'tel', 'textarea'];
    const { target } = event;

    return (validTagNames.includes(target.tagName) && validTypes.includes(target.type));
  }

  parentClick() {
    this.showKeyboard = false;
  }

  childClick(event: Event) {
    event.stopPropagation();
  }

  onKeyClick(event) {
    this.keyboardService.dispatchEventToIFrame(event)
  }

  // Abstract
  abstract CalledOnInit(): any;

  abstract CalledAfterViewInit(): any;

  abstract CalledIFramClickHandeler(): any;

  abstract CalledIFrameFocusHandler(): any;

  abstract onSetUp(doc: Document): void;
}
