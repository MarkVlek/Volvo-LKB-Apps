import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom, Observable } from 'rxjs';

import { URL_TO_NODE } from "../constants";
import { StatisticService } from "./Statistics/statistics.service";
import { DiseControlFile } from "../model/diseControlFile";

@Injectable()
export class BackendService {

    constructor(private http: HttpClient, private statisticService: StatisticService) { }

    public GetByggDinVolvoUrl() {
        return this.http.get(URL_TO_NODE + "api/volvo/carconfigurator", { responseType: 'text' });
    }

    public getEnvironments(): Observable<any> {
        return this.http.get(URL_TO_NODE + "api/volvoenvironment")
    }

    public getCategoryApps(): Observable<any> {
        return this.http.get(URL_TO_NODE + "api/volvoreason");
    }

    public getFeatureCategories(): Observable<any> {
        return this.http.get(URL_TO_NODE + "api/volvofeature");
    }

    public async GetDiseScreensaver(): Promise<string> {
        const observable = this.http.get(URL_TO_NODE + "api/volvoscreensaver/dise", {
            responseType: 'blob'
        });
        const blob = await lastValueFrom(observable);
        
        const videoUrl = URL.createObjectURL(blob);

        return videoUrl;
    }
}