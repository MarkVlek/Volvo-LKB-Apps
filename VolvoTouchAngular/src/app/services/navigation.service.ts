import { Injectable } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'
import { Subject } from 'rxjs'
import { PageCard } from '../enums/page-card-enum';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    pageChanged$: Subject<string> = new Subject();
    pageCardClicked$: Subject<string> = new Subject();
    currentLocationPath: string[] = [];
    currentPath: string = "";
    currentPath$: Subject<string> = new Subject<string>();
    public backClicked: Subject<void> = new Subject<void>();
    showBackButton: boolean = false;
    iframeBackBtn: boolean = false;
    iframeRefresh: boolean = false;
    
    public atOrigin: boolean
    public history: string[] = []

    constructor(private router: Router) {
        this.router.events.subscribe((event) => {
            if (this.history.length > 0) {
                this.atOrigin = true;
            }
            else {
                this.atOrigin = false;
            }
            if (event instanceof NavigationEnd) {
                this.currentLocationPath = event.url.split('/').filter(entry => entry.trim() != '');
                this.pageChanged$.next(event.urlAfterRedirects)
                this.history.push(event.urlAfterRedirects)
            }
        })
    }
    // navigateToEX60FromIframe(): void {
    //     this.router.navigate([PageCard.EX60]).then(success => {
    //     });
    // }

    back(): void {
        this.backClicked.next();
        if (decodeURI(this.currentLocationPath[0]) == PageCard.EX60_Leasing) {
            this.router.navigate([PageCard.EX60]);
            return;
        }
        if(decodeURI(this.currentLocationPath[0]) == PageCard.EX60_App) {
            this.router.navigate([PageCard.EX60]);
            return;
        }
        if (decodeURI(this.currentLocationPath[0]) == PageCard.ElectrificationIframe) {
            this.router.navigate([PageCard.EX60]);
            return;
        }
        if (decodeURI(this.currentLocationPath[0]) == PageCard.LaunchIframe) {
            if (this.history.length > 1) {
                const previousPath = this.history[this.history.length - 2];
                if (previousPath && previousPath.includes("EX60Landing")) {
                    this.router.navigate([PageCard.EX60], { skipLocationChange: true });
                    return;
                }
            }
            return;
        }
        if (decodeURI(this.currentLocationPath[0]) == PageCard.Leveransklara_bilarcategory) {
            this.router.navigate([PageCard.Leveransklara_Bilar])
        }
        if (decodeURI(this.currentLocationPath[0]) == PageCard.Leveransklara_bilar_detail) {
            this.router.navigate([PageCard.Leveransklara_bilarcategory])
        }
        if (decodeURI(this.currentLocationPath[0]) == PageCard.ElectrificationItemView) {
            this.router.navigate([PageCard.ElectrificationCategories])
        }
        if (decodeURI(this.currentLocationPath[0]) == PageCard.ElectrificationCategories) {
            this.router.navigate([PageCard.Electrification])
        }
        if (
            decodeURI(this.currentLocationPath[0]) === PageCard.RTCCategoryList &&
            (decodeURI(this.currentLocationPath[1]) === "Privat" || decodeURI(this.currentLocationPath[1]) === "Företag")
        ) {
            this.router.navigate([PageCard.RTCCategoryList, PageCard.Tjänster]);
            return;
        }

        switch (this.currentLocationPath.length) {
            case 2:
                if (decodeURI(this.currentLocationPath[0]) == PageCard.RTCCategoryList) {
                    this.router.navigate([PageCard.RTCCategoryList, PageCard.Innovationer])
                }
                break;
            case 3:
                if (decodeURI(this.currentLocationPath[0]) == PageCard.AccessoriesCategory) {
                    this.router.navigate([PageCard.Sök_Tillbehör])
                }
                if (decodeURI(this.currentLocationPath[1]) == PageCard.Innovationer) {
                    this.router.navigate([PageCard.RTCCategoryList, PageCard.Innovationer])
                }
                // if (decodeURI(this.currentLocationPath[1]) == "Privat") {
                //     this.router.navigate([PageCard.RTCCategoryList, PageCard.Tjänster])
                // }
                // if (decodeURI(this.currentLocationPath[1]) == "Företag") {
                //     this.router.navigate([PageCard.RTCCategoryList, PageCard.Tjänster])
                // }
                if (decodeURI(this.currentLocationPath[1]) == PageCard.Launch) {
                    this.router.navigate([PageCard.RTCCategoryList, PageCard.Launch])
                }
                if (decodeURI(this.currentLocationPath[0]) == PageCard.RTCItemList) {
                    this.router.navigate([PageCard.RTCCategoryList, decodeURI(this.currentLocationPath[1])])
                }
                
                break;
            case 4:
                if (decodeURI(this.currentLocationPath[0]) == PageCard.AccessoriesCategoryDetails) {
                    this.router.navigate(
                        [
                            PageCard.AccessoriesCategory,
                            decodeURIComponent(this.currentLocationPath[2]),
                            decodeURIComponent(this.currentLocationPath[3])
                        ]);
                }
                if (decodeURI(this.currentLocationPath[0]) == PageCard.RTCItemList) {
                    this.router.navigate([PageCard.RTCCategoryList, decodeURI(this.currentLocationPath[1])])
                }

                break;
            case 5:
                if (decodeURI(this.currentLocationPath[0]) == PageCard.AccessoriesProduct) {
                    // path: PageCard.AccessoriesCategoryDetails + "/:category/:car/:year",
                    this.router.navigate([PageCard.AccessoriesCategoryDetails,
                    decodeURIComponent(this.currentLocationPath[1]),
                    decodeURIComponent(this.currentLocationPath[3]),
                    decodeURIComponent(this.currentLocationPath[4])
                    ]);
                }
                break;
        }
    }
}