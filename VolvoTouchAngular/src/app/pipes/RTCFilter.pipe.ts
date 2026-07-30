
import { Injectable, Pipe, PipeTransform } from "@angular/core";
import { RTCFiltered } from "../pages/reason-to-choose/rtc-models/rtc-filtered.model";
import { AnalyticsService } from "../services/analytics/analytics.service";

@Pipe({ name: "RTCFilterPipe" })
@Injectable()
export class RTCFilterPipe implements PipeTransform {

    constructor(private analyticService: AnalyticsService) {
    }

    transform(value: RTCFiltered[], searchText?: any): any {
        if (!value) return [];

        if (!searchText) return [];

        searchText = searchText.toLowerCase();

        var filterResult = value.filter(data => {
            return data.category.toLowerCase().includes(searchText)
                || data.item.toLowerCase().includes(searchText)
                || data.name.toLocaleLowerCase().includes(searchText);
        });

        this.analyticService.postEventToAnalytics(searchText,'Search','EndlessAisle',filterResult.length);

        return filterResult
    }
}