import { Subject } from "rxjs";
import { SalesPerson } from "../models/sales-person.model";

export class SalesPersonService {
    public current: SalesPerson | null = null;
    current$: Subject<SalesPerson | null> = new Subject<SalesPerson | null>();
    isShowing: boolean = false;
    isShowing$: Subject<boolean> = new Subject<boolean>();
    salesList: SalesPerson[] = [];

    constructor() {
        this.isShowing$.subscribe(() => {
            this.isShowing = !this.isShowing;
        })
        this.current$.subscribe(data => {
            this.current = data;
        })
    }

    changeSalesPerson(input: SalesPerson) {
        this.current$.next(input);
    }
}