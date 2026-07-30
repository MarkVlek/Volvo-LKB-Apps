import { Injectable } from '@angular/core';
// import {} from '@types/google.analytics'; //this is needed to be able to build the project
declare let ga: Function;

@Injectable()
export class AnalyticsService {
    analyticsUrl: string;
    constructor() {
    }

    postToAnalytics(message) {
        this.analyticsUrl = message;
        ga('send', 'pageview', this.analyticsUrl);
    }

    postEventToAnalytics(searchString, action, label, itemCount) {
        ga('send', {
            hitType: 'event',
            eventCategory: searchString,
            eventAction: action,
            eventLabel: label,
            eventValue: itemCount
        });
    }

    startSession() {
        ga('send', 'pageview', { 'sessionControl': 'start' });
    }

    endSession() {
        ga('send', 'pageview', { 'sessionControl': 'end' });
    }

    backButtonPressed() {
        const urlItems = this.analyticsUrl.split('/');
        urlItems.pop();

        this.postToAnalytics(urlItems.join('/'));
    }
}
