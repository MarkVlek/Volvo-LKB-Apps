import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, timestamp } from 'rxjs';

import { URL_TO_NODE } from '../constants';
import { StatisticService } from './Statistics/statistics.service';
import { Router } from '@angular/router';
import { ScreenSaverTimerService } from './screen-saver-timer.service';
import { PageCard } from '../enums/page-card-enum';
import { NavigationService } from './navigation.service';
import { ConfigService } from './config.service';
import { Screensaver } from '../model/screenSaver';
import { LanguageService } from './language.service';
import { IframeService } from './iframe.service';
import { EnergySaverService } from './energy-saver.service';
import { BackendService } from './backend.service';
import { Block } from '@angular/compiler';

@Injectable()
export class ScreensaverService {
    screensaversSubscription: Observable<any>;
    screenSaverState = new Subject<boolean>();
    url: string = URL_TO_NODE + 'api/volvoscreensaver';
    screensavers: any = [];
    screenSaver: Screensaver;
    showScreensaver: boolean = false;
    diseScreensaverUrl: any;
    videoRecreateTimer: any;

    constructor(private http: HttpClient,
        private statisticsService: StatisticService,
        private router: Router,
        private screenSaverTimerService: ScreenSaverTimerService,
        private navigationService: NavigationService,
        private configService: ConfigService,
        private languageService: LanguageService,
        private iframeService: IframeService,  
        private energySaverService: EnergySaverService,
        private backendService: BackendService
) {
    }

    setScreenSaveState(state: boolean) {
        this.screenSaverState.next(state);
    }

    getScreensavers(): Observable<any> {
        return this.screensaversSubscription;
    }

    async getDiseScreensaver() {
        this.diseScreensaverUrl = await this.backendService.GetDiseScreensaver();
    }

    initiateScreensavers() {
        // this.getDiseScreensaver();
        this.screensaversSubscription = this.http.get(this.url);

        this.screensaversSubscription.subscribe(data => {
            this.screensavers = data;
            this.screenSaver = this.screensavers[0];
        })
    }

    postErrorLog(diagnostics: any) {
        console.log("Posting freeze diagnostics to backend")
        this.http.post(URL_TO_NODE + 'api/volvoscreensaver/log', {
            details: diagnostics
            }).subscribe({
                next: () => console.log('Freeze log sent successfully'),
                error: (err) => console.error('Failed to send freeze log', err)
            });
    }

    exitScreensaver() { 
        this.initStatisticSession();
        this.screenSaverTimerService.startTimer();
        this.stopVideoRecreation();
        // this.setScreenSaveState(false);
        this.showScreensaver = false;
        if(this.configService.config["VolvoEndlessAisle_Showroom"]?.toString().toLowerCase() == "true"){
            this.languageService.setActiveCountry("se")
            this.languageService.setActiveCountryName("Sverige")
            this.languageService.setActiveLanguage("se");
            this.iframeService.setEvent('country');

        }
        this.navigationService.pageCardClicked$.next(this.configService.startPage);
        this.router.navigate([this.configService.startPage]);
        // this.getDiseScreensaver();
    }

    initStatisticSession() {
        if (this.energySaverService.isActive) {
            console.log('Energy saver active - skipping statistic');
            return;
        }
        this.statisticsService.currentStatistic = {
        App: this.configService.startPage,
        DisplayPrefix: this.configService.playerName,
        Dealer: this.configService.GetDealerID(),
        StartOfSession: new Date(),
        SessionLengthInSec: 0
        };
        this.statisticsService.startSession();
        // this.analyticService.postEventToAnalytics('Screensaved exited', "Screensaver exited", "Screensaver", 1);
    }

    startVideoRecreation() {
        this.stopVideoRecreation();
        
        this.videoRecreateTimer = setInterval(() => {
        this.showScreensaver = false;
        
        setTimeout(() => {
            this.showScreensaver = true;

            setTimeout(() => {
                const video = document.querySelector('.visibleScreenSaver video') as HTMLVideoElement;
                if (video) {
                    video.muted = true;
                    video.play().catch(err => console.warn('Autoplay blocked:', err));
                } else {
                    console.error('❌ Video element not found after recreation');
                }
            }, 150);
        }, 100);
        }, 30 * 60 * 1000);
    }

    stopVideoRecreation() {
        if (this.videoRecreateTimer) {
        clearInterval(this.videoRecreateTimer);
        }
    }

    //Disable screensaver here 
}