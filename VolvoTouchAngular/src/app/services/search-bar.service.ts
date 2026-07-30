import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class SearchBarService {
    public searchBarActive: boolean = false;
    public onSearchBar$: Subject<boolean> = new Subject<boolean>();

    constructor() {
        this.onSearchBar$.subscribe(value => {
            this.searchBarActive = value;
        })
    }
}