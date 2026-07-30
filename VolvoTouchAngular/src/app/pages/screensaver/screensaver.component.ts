import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { Screensaver } from 'src/app/model/screenSaver';
import { ConfigService } from 'src/app/services/config.service';
import { IframeService } from 'src/app/services/iframe.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { ScreensaverService } from 'src/app/services/screen-saver.service';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { StatisticService } from 'src/app/services/Statistics/statistics.service';
import { LanguageService } from 'src/app/services/language.service';
import { Statistic } from 'src/app/model/statistic';
import { distinctUntilChanged, tap } from 'rxjs';
import { EnergySaverService } from 'src/app/services/energy-saver.service';

@Component({
  selector: 'app-screensaver',
  templateUrl: './screensaver.component.html',
  styleUrls: ['./screensaver.component.scss']
})
export class ScreensaverComponent implements OnInit {

  screenSavers: Screensaver[] = [];
  screenSaver: Screensaver;
  index = 0;
  imageShowTime = 20;
  screenSaverIsOn: boolean = false
  private freezeTimer: any;
  private maxResets = 5;
  private resetAttempts = 0;
  private isResetting = false;

  private readonly freezeCheckIntervalMs = 3000;
  private readonly freezeToleranceChecks = 3;

  @ViewChild('video', { static: false }) videoRef: ElementRef<HTMLVideoElement>;

  constructor(
    private configservice: ConfigService,
    private router: Router,
    private screenSaverTimerService: ScreenSaverTimerService,
    private screenSaverService: ScreensaverService,
    private navigationService: NavigationService,
    private statisticsService: StatisticService,
    private analyticService: AnalyticsService,
    private iframeService: IframeService,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef,
    private energySaverService: EnergySaverService) { }

  ngOnInit(): void {
    this.screenSaverIsOn = true;
  }

  ngAfterViewInit() {

    this.screenSaverService.screenSaverState.subscribe(res => {
      if(res === true) {
        this.resetAttempts = 0;
        this.analyticService.postEventToAnalytics('Screensaved started', "Screensaver started", "Screensaver", 1);

        this.tryToGetScreenSavers();
      }
      else {
        this.screenSaverIsOn = false;
        this.stopFreezeWatchdog();
      }
    })
  }

  tryToGetScreenSavers() {
    if (this.screenSaverService.screensavers.length > 0) {
      this.screenSaver = this.screenSaverService.screensavers[0];
      this.startSingleVideo();
    } else {
      this.screenSaverService.initiateScreensavers();
      setTimeout(() => this.tryToGetScreenSavers(), 3000);
    }
  }

  private startFreezeWatchdog() {
    this.stopFreezeWatchdog();

    let lastVideoTime = 0;
    let freezeCount = 0;

    this.freezeTimer = setInterval(() => {
      if (!this.screenSaverIsOn || !this.screenSaver?.isVideo) {
        return;
      }

      const video = document.getElementById("video") as HTMLVideoElement | null;
      if (!video) return;

      if (video.currentTime === lastVideoTime) {
        freezeCount++;
        console.warn(`Video freeze suspected (#${freezeCount})`);

        if (freezeCount >= this.freezeToleranceChecks) {
          console.error("VIDEO FROZEN → switching to next");
          this.handleVideoFreeze();
        }
      } else {
        lastVideoTime = video.currentTime;
        freezeCount = 0;
      }
    }, this.freezeCheckIntervalMs);
  }

  private stopFreezeWatchdog() {
    if (this.freezeTimer) {
      clearInterval(this.freezeTimer);
      this.freezeTimer = null;
    }
  }

  private async handleVideoFreeze() {
    if (this.isResetting) {
      console.log('Reset already in progress, skipping...');
      return;
    }
    
    this.isResetting = true;
    this.stopFreezeWatchdog();

    const video = this.videoRef?.nativeElement || document.getElementById("video") as HTMLVideoElement | null;
    if (!video || !this.screenSaver) return;

    if (this.resetAttempts >= this.maxResets) {
      console.error('Max freeze resets reached; exiting screensaver');
      this.getVideoDiagnostics(video);
      this.exitScreenSaver(true);
      return;
    }
    this.resetAttempts++;

    console.warn('Video frozen, resetting source…');

    video.pause();
    video.removeAttribute('src');
    video.load();
    
    video.src = this.screenSaver.fileName + '?cb=' + Date.now();
    video.muted = true;
    video.playsInline = true;
    video.load();

    const loadTimeout = new Promise<void>((_, reject) => 
      setTimeout(() => reject(new Error('Video load timeout')), 10000)
    );
    
    const videoReady = new Promise<void>(resolve => {
      const ready = () => {
        video.removeEventListener('loadeddata', ready);
        resolve();
      };
      video.addEventListener('loadeddata', ready, { once: true });
    });

    try {
    await Promise.race([videoReady, loadTimeout]);
      video.currentTime = 0;
      await video.play();
      this.startFreezeWatchdog();
    } catch (err) {
      console.error('Video failed after reset', err);
      setTimeout(() => this.handleVideoFreeze(), 1500);
    }
  }

  private getVideoDiagnostics(video: HTMLVideoElement) {
    const error = video.error;
    let bufferStatus = 'No Buffer';

    if (video.buffered.length > 0) {
      const time = video.currentTime;
      let isBuffered = false;
      for (let i = 0; i < video.buffered.length; i++) {
        if (time >= video.buffered.start(i) && time <= video.buffered.end(i)) {
          isBuffered = true;
          bufferStatus = `Buffered (Range: ${video.buffered.start(i).toFixed(2)} - ${video.buffered.end(i).toFixed(2)})`;
          break;
        }
      }
      if (!isBuffered) bufferStatus = 'Buffer Underrun (Current time outside buffered ranges)';
    }

    let suspectedCause = "Unknown";

    if (error) {
      suspectedCause = `Media Error (Code ${error.code})`;
    } 
    else if (video.networkState === 2 && video.readyState < 3) {
      suspectedCause = "Network Stalled (Buffering)";
    } 
    else if (video.paused || video.ended) {
      suspectedCause = "Logic Error (Video is paused/ended but watchdog triggered)";
    } 
    else if (video.readyState >= 3 && !video.paused) {
      suspectedCause = "Hardware/Decoding Hang (GPU Driver or Browser Renderer Issue)";
    }
    const readyStates = ['HAVE_NOTHING', 'HAVE_METADATA', 'HAVE_CURRENT_DATA', 'HAVE_FUTURE_DATA', 'HAVE_ENOUGH_DATA'];

    var diagnostics = {
      suspectedCause: suspectedCause,
      currentTime: video.currentTime,
      duration: video.duration,
      error: error ? `Code: ${error.code}, Message: ${error.message}` : 'None',
      readyState: readyStates[video.readyState] || video.readyState,
      bufferStatus: bufferStatus,
      paused: video.paused,
      ended: video.ended
    }

    this.screenSaverService.postErrorLog(diagnostics);
  }

  initStatisticSession() {
    if (this.energySaverService.isActive) {
      console.log('Energy saver active - skipping statistic');
      return;
    }
    console.log('CREATING STATISTIC FOR START PAGE: ' + this.configservice.startPage)
    this.statisticsService.currentStatistic = {
      App: this.configservice.startPage,
      DisplayPrefix: this.configservice.playerName,
      Dealer: this.configservice.GetDealerID(),
      StartOfSession: new Date(),
      SessionLengthInSec: 0
    };
    this.statisticsService.startSession();

    this.screenSaverTimerService.startTimer();
    this.screenSaverService.setScreenSaveState(false)
    this.analyticService.postEventToAnalytics('Screensaved exited', "Screensaver exited", "Screensaver", 1);
  }

  exitScreenSaver(videoFrozen: boolean = false) {
    if (videoFrozen == false) this.initStatisticSession();

    this.languageService.setActiveCountry('se');
    this.languageService.setActiveLanguage('se');
    this.languageService.setActiveCountryName('Sverige');

    this.SetPageCard();

    if(this.configservice.startPage == "Test Drive" || 
       this.configservice.config["VolvoEndlessAisle_ByggDinVolvo"]?.toString().toLowerCase() === "true" || 
       this.configservice.config["VolvoEndlessAisle_Showroom"]?.toString().toLowerCase() === "true") {
      this.iframeService.setEvent('reload');
    }

    this.iframeService.setEvent('country');
    this.iframeService.setEvent('language');

    this.router.navigate([this.configservice.startPage]);
  }

  startSingleVideo(retryCount = 0) {
    if (!this.screenSaverIsOn || !this.screenSaver?.isVideo) return;

    this.cdr.detectChanges();

    const video = this.videoRef?.nativeElement;
    
    if (!video) {

    if (retryCount < 10) {
        console.warn('Video element not ready, retrying...');
        setTimeout(() => this.startSingleVideo(retryCount + 1), 100);
      } else {
        console.error('Video element never became available');
      }
      return;
    }

    video.muted = true;
    video.playsInline = true;

    const onLoadedData = () => {
      video.removeEventListener('loadeddata', onLoadedData);
      
      video.play()
        .then(() => {
          console.log('Video started successfully');
          this.startFreezeWatchdog();
        })
        .catch(err => {
          console.warn('Initial play failed, retrying', err);
          setTimeout(() => this.startSingleVideo(), 1000);
        });
    };

    video.addEventListener('loadeddata', onLoadedData);
    
    video.load();
  }

  checkIfShouldRefresh() {
    // this.dataService.checkIfShouldRefresh();
  }

  exitScreensaverSwitchChannel(channel: string) {
    this.screenSaverTimerService.startTimer();
    this.screenSaverService.setScreenSaveState(false);
    this.analyticService.postEventToAnalytics('Screensaved exited', "Screensaver exited", "Screensaver", 1);
    this.languageService.setActiveCountry('se');
    this.languageService.setActiveLanguage('se');
    this.languageService.setActiveCountryName('Sverige');

    if (channel.toLocaleLowerCase().trim() === "byggdinvolvo") {
      this.navigationService.pageCardClicked$.next(PageCard.Bygg_din_Volvo);
      this.router.navigate([PageCard.Bygg_din_Volvo]);
    }
    else if (channel.toLocaleLowerCase().trim() === "shop") {
      this.navigationService.pageCardClicked$.next(PageCard.Shop);
      this.router.navigate([PageCard.Shop]);
    }
    else if (channel.toLocaleLowerCase().trim() === "care by volvo") {
      this.navigationService.pageCardClicked$.next(PageCard.Care_by_Volvo);
      this.router.navigate([PageCard.Care_by_Volvo]);
    }
    else if (channel.toLocaleLowerCase().trim() === "leveransklara-bilar") {
      this.navigationService.pageCardClicked$.next(PageCard.Leveransklara_Bilar);
      this.router.navigate([PageCard.Leveransklara_Bilar]);
    }
    else if (channel.toLocaleLowerCase().trim() === "tillbehör") {
      this.navigationService.pageCardClicked$.next(PageCard.Sök_Tillbehör);
      this.router.navigate([PageCard.Sök_Tillbehör]);
    }
    else {
      this.SetPageCard();
      this.router.navigate([this.configservice.startPage]);
    }
  }

  IsRTCChannel() {
    return this.configservice.startPage.includes("Innovationer") || this.configservice.startPage.includes("Tjänster") || this.configservice.startPage.includes("Launchevent") 
  }

  SetPageCard() {
    if(this.IsRTCChannel()) {
      let paths = this.configservice.startPage.split('/')
      this.navigationService.pageCardClicked$.next(paths[paths.length - 1]);
    }
    else {
      this.navigationService.pageCardClicked$.next(this.configservice.startPage);
    }
  }

}


