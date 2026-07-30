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

    back(): void {
        this.backClicked.next();

        if (decodeURI(this.currentLocationPath[0]) == PageCard.Leveransklara_bilarcategory) {
            this.router.navigate([PageCard.Leveransklara_Bilar])
        }
        if (decodeURI(this.currentLocationPath[0]) == PageCard.Leveransklara_bilar_detail) {
            this.router.navigate([PageCard.Leveransklara_bilarcategory])
        }
    }
}