import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_TO_GFHVOL, URL_TO_GFHVOL_TEST } from "../../constants";
import { Statistic } from 'src/app/model/statistic';
import { InteractionTrackingService } from './interaction-tracker.service';


@Injectable()
export class StatisticService {

    public dwellTimeStart: number;
    public dwellTimeEnd: number;

    public currentStatistic: Statistic
    public currentStatistics: Statistic[] = []

    constructor(private http: HttpClient, private interactionTracker: InteractionTrackingService) {
        
    }

    async postStatistic() {
        if(this.currentStatistics.length == 0)
            return

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = URL_TO_GFHVOL + 'statistic';
        let body = JSON.stringify(this.currentStatistics)
        
        this.currentStatistics = []

        this.http.post(url, body, { headers: headers, responseType: 'text' }).subscribe({

            next: async (data) => {
            },
            error: (err) => {
                console.log(err)
            },
            complete: () => {
                console.log('Statistics sent to Grassfeeder')
            }

        });

        this.currentStatistic = null;

    }

    startSession() {
        this.dwellTimeStart = Date.now();
        this.dwellTimeEnd = null;
        this.interactionTracker.resetCounter();
    }

    endSession() {
        this.dwellTimeEnd = Date.now();
        if (this.currentStatistic) {
            this.currentStatistic.InteractionCount = this.interactionTracker.getInteractionCount();
        }
    }

    getSessionLengthInSec() {
        return Math.round((this.dwellTimeEnd - this.dwellTimeStart) / 1000);
    }
    getCurrentInteractionCount(): number {
        return this.interactionTracker.getInteractionCount();
    }

    /**
     * Helper method to end current session and post it
     * @param forcePost If true, posts even with 0 interactions. If false, only posts if InteractionCount > 0
     * @param minSessionLength Minimum session length in seconds to post the statistic
     */
    endAndPostCurrentSession(forcePost: boolean = false, minSessionLength: number = 0) {
        if (!this.currentStatistic) {
            return;
        }

        this.endSession();
        this.currentStatistic.SessionLengthInSec = this.getSessionLengthInSec();
        this.currentStatistic.InteractionCount = this.getCurrentInteractionCount();

        // For delivery sessions, always post. For others, check interaction count
        const shouldPost = forcePost || 
                          this.currentStatistic.App === 'Delivery' || 
                          this.currentStatistic.App === 'DeliveryFeatures' || 
                          this.currentStatistic.InteractionCount > 0;

        if (shouldPost) {
            this.currentStatistics.push(this.currentStatistic);
            this.postStatistic();
        }

        this.currentStatistic = null;
    }
}
