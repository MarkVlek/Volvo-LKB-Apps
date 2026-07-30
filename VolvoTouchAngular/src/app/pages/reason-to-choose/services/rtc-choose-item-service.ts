import { Subject } from "rxjs";
import { RTCItem } from "../rtc-models/rtc-item.model";
import { Injectable } from "@angular/core";

@Injectable()
export class RTCChooseItemService {
    selectedItem: RTCItem;
    selectedItem$: Subject<RTCItem> = new Subject();
    onLoan: boolean = false;
    onCarPay: boolean = false;

    constructor() {
        this.selectedItem$.subscribe(item => {
            this.selectedItem = item;
            this.onLoan = item.has_loan_calculator;
            this.onCarPay = item.header1 == "CarPay"
        })
    }

    public ChangeItem(item: RTCItem) {
        this.selectedItem$?.next(item);
    }

}