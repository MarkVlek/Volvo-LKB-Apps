import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { switchMap, timer } from "rxjs";
import { ScreensaverService } from "./screen-saver.service";

@Injectable()
export class ScreenRefreshService {
    private readonly refreshInterval = 600000
    private refreshUrl = 'http://localhost:3000/api/refresh';
    private onScreenSaver: boolean = false;

    constructor(
        private http: HttpClient,
        private screenSaverService: ScreensaverService) {
        this.screenSaverService.screenSaverState.subscribe(value => {
            this.onScreenSaver = value;
        })
    }

    startScreenRefreshTimer(): void {
        timer(0, this.refreshInterval).pipe(
            switchMap(() => this.http.get<boolean>(this.refreshUrl))
        ).subscribe((refreshRequired: boolean) => {
            if (refreshRequired) {
                if (this.onScreenSaver) {
                    this.refreshScreen();
                }
                else {
                    this.http.post(this.refreshUrl, "")
                }
            }
        });
    }

    refreshScreen(): void {
        location.reload();
    }
}