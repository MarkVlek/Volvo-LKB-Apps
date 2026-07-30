import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { URL_TO_NODE } from '../constants';
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { LkbCategory, VolvoLeveransklarabilar } from "../pages/leveransklarabilar/models/LkbCategory";
import { ConfigService } from "./config.service";
import { VolvoLkbInterestRate } from "../pages/leveransklarabilar/models/LkbInterestRate";

@Injectable()
export class LkbService {
    allBrandsAvailable: boolean = false;
    carLocationsCount: any;
    selectedCar: any;
    startCategory: any;
    filteredCars: BehaviorSubject<VolvoLeveransklarabilar[]> = new BehaviorSubject<VolvoLeveransklarabilar[]>([]);
    currentSelected$: Subject<LkbCategory> = new Subject();
    toggleDrawer$: Subject<void> = new Subject();
    showInsurance = false;
    allCars: VolvoLeveransklarabilar[] = [];
    unfilteredCars: VolvoLeveransklarabilar[] = [];
    sideBar: boolean = true;
    currentPaginationPage: any;
    paginationAllLoaded: any;
    displayedCars: VolvoLeveransklarabilar[] = [];

    constructor(private http: HttpClient, public configService: ConfigService) {}

    getCategoryTypes() {
        return [
            new LkbCategory(
                "Nya bilar",
                "Nya bilar",
                "Nästan ny Volvo",
                'Category',
                'assets/images/AppSpecific/LeveransKlaraBilar/' + 'LKB_nya.png',
                'assets/images/AppSpecific/LeveransKlaraBilar/' + 'LKB_nya.png',
                'Utforska vårt utbud av nya bilar i lager'
            ),
            new LkbCategory(
                "Volvo Selekt",
                "Selekt",
                "Nästan ny Volvo",
                'Category',
                'assets/images/AppSpecific/LeveransKlaraBilar/' + 'LKB_selekt.png',
                'assets/images/AppSpecific/LeveransKlaraBilar/' + 'LKB_selekt.png',
                'Utforska våra certifierade begagnade bilar'
            ),
            new LkbCategory(
                "Alla bilar",
                "Alla Volvo",
                "",
                'Category',
                'assets/images/AppSpecific/LeveransKlaraBilar/' + 'LKB_alla.png',
                'assets/images/AppSpecific/LeveransKlaraBilar/' + 'LKB_alla.png',
                'Utforska alla bilar i lager'
            )
        ];
    }

    initializeCars() {
        this.getAllCars().subscribe(data => {
            this.allCars = data
            this.unfilteredCars = this.allCars;
        })
    }

    setFilteredCars(filteredCars: any[]) {
        this.filteredCars.next(filteredCars)
    }

    getAllCars(): Observable<VolvoLeveransklarabilar[]> {
        const url = URL_TO_NODE + 'api/volvoleveransklarabilar';
        return this.http.get<VolvoLeveransklarabilar[]>(url);
    }

    getCar(regNr: string) {
        const url = URL_TO_NODE + 'api/volvoleveransklarabilar/' + regNr;
        return this.http.get<VolvoLeveransklarabilar>(url);
    }

    getLeveransklarabil(regnr: string): Observable<VolvoLeveransklarabilar> {
        const url = URL_TO_NODE + 'api/volvoleveransklarabilar/' + regnr;
        return this.http.get<VolvoLeveransklarabilar>(url);
    }

    getCurrentBranch() {
        return this.configService.getConfig("VolvoEndlessAisle_LKB_branch");
    }

    setLocationsCount(locationsCount) {
        this.carLocationsCount = locationsCount;
    }

    setStartCategory(category) {
        this.startCategory = category
    }

    setSelectedCar(car) {
        this.selectedCar = car;
    }

    setAllBrandsAvailable() {
        this.allBrandsAvailable = this.configService.GetLKBAllBrandsAvailable();
    }

    getVolvoInsurance(message): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = URL_TO_NODE +'/api/insurance';
        return this.http.post(url, message, { headers: headers, responseType: 'text' });
    }

    getWaykeInsurance(message): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = URL_TO_NODE + '/api/wayke/insurance';
        return this.http.post(url, message, { headers: headers, responseType: 'text' });
    }

    getInterestRate(): Observable<VolvoLkbInterestRate[]> {
        const url = URL_TO_NODE + 'api/volvoleveransklarabilar/rate/' + this.configService.GetDealerID();
        return this.http.get<VolvoLkbInterestRate[]>(url);
    }

    upsertInterestRate(newInterestRate: number) {
        const url = URL_TO_NODE + 'api/volvoleveransklarabilar/upsert/rate';
        const dealerId = Number(this.configService.GetDealerID());
        const interestRate = Number(newInterestRate);

        if (isNaN(dealerId) || isNaN(interestRate)) {
            // Handle invalid values here
            return null;
        } else {
            const params = new HttpParams().set('dealerId', dealerId).set('interestRate', interestRate);
            this.http.get(url, { params }).subscribe(response => {
                // Handle the response
            }, error => {
                console.log(error)
                // Handle the error
            });
        }
    }
}