import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Injectable } from "@angular/core";
import { Observable, Subject, Subscription, timer } from "rxjs";
import { CastingScreen } from "../model/castingScreen";
import * as moment from 'moment'
import { TokenGetterTime } from "../constants";

export interface IToken {
    token: string;
}

@Injectable()
export class TokenService {
    token: any;
    isCasting: boolean = false;
    observer$: Observable<any>;
    subscription$: Subscription;
    onChange$: Subject<any> = new Subject<any>();
    url: string = "http://localhost:3000/api/castbdv/token/find"
    baseUrl: string = "http://localhost:3000/api/"

    constructor(
        private http: HttpClient) {
        this.observer$ = timer(0, TokenGetterTime);
        this.onChange$.subscribe(t => {
            {
                if (t == null) {
                    this.castBdv("")
                }
                else {
                    if (this.isCasting) {

                        this.castBdv(t)
                    }
                }
            }
        })
    }

    start() {
        this.subscription$ = this.observer$.subscribe(() => {
            this.getToken().subscribe(value => {
                this.token = value.token;
                if (this.token) {
                    this.onChange$.next(this.token);
                }
            })
        })
    }

    end() {
        this.token = null;
        this.isCasting = false;
        this.subscription$.unsubscribe();
        this.onChange$.next(null)
    }

    public getToken(): Observable<IToken> {
        return this.http.get<IToken>(this.url);
    }

    pressCast() {
        switch (this.isCasting) {
            case (true):
                this.castBdv("")
                break;
            case (false):
                this.castBdv(this.token)
                break;
        }
        this.isCasting = !this.isCasting;
    }

    getCastingScreens(): Observable<CastingScreen[]> {
        return this.http.get<CastingScreen[]>(this.baseUrl + "castingscreen");
    }

    checkIfDateIsOk(date: string): boolean {
        let momentInput = moment(date);
        let today = moment(new Date)
        moment.duration()
        var duration = moment.duration(momentInput.diff(today));
        if (Math.abs(duration.asMinutes()) < 10) {
            return true;
        }
        return false;
    }


    castBdv(varValue: string) {
        var url = "http://localhost:3000/api/castingscreen/playervariable"
        let body = { "varName": "token", "varValue": varValue }
        this.http.post(url, body).subscribe()
    }
}