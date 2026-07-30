import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { IframeKeyBoardService } from 'src/app/services/Iframe-keyboard.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { BaseIframeComponent } from 'src/app/pages/iframes/base-iframe/base-iframe.component';
import { IframeService } from 'src/app/services/iframe.service';
import { LanguageService } from 'src/app/services/language.service';
import { InteractionTrackingService } from 'src/app/services/Statistics/interaction-tracker.service';

@Component({
  selector: 'app-ondemand-iframe',
  templateUrl: './ondemand-iframe.component.html',
  styleUrls: ['./ondemand-iframe.component.scss']
})
export class OndemandIframeComponent extends BaseIframeComponent{
  @ViewChild('IFrame') iframe!: ElementRef;
  url$: string = '';
  language: string = 'se';
  currentLanguage: string = "Swedish";
  
  constructor(
    configService: ConfigService,
    ScreenSaverTimerService: ScreenSaverTimerService,
    private IFrameService: IframeService,
    private languageService: LanguageService,
    keyboardService: IframeKeyBoardService, protected override interactionTracker: InteractionTrackingService) {
    super(configService, ScreenSaverTimerService, keyboardService, interactionTracker)
  }

  CalledOnInit() {
    this.setUrl();
    this.IFrameService.getEvent().subscribe(event => {
      if (event == 'language') {
        this.language = this.languageService.getActiveLanguage();
        this.setUrl()
      }
    })
  }

  CalledAfterViewInit(){ }

  CalledIFramClickHandeler() { }

  CalledIFrameFocusHandler() { }

  override onSetUp(doc: Document) { }

  setUrl(){
    if (this.language == "se") {
      this.url$ = "https://www.volvocars.com/se/on-demand"
    }
    else {
      this.url$ = "https://www.volvocars.com/en-se/on-demand"
    }
  }
}

