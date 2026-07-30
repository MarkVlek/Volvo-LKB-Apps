import { Injectable } from "@angular/core";
import { RTCCategory } from "../pages/reason-to-choose/rtc-models/rtc-category.model";
import { RTCItem } from "../pages/reason-to-choose/rtc-models/rtc-item.model";

@Injectable()
export class ElectrificationService {

    public catagories: RTCCategory;

    getItem(name: string): RTCItem {
        return this.catagories.items.find(e => e.name.split(',')[0] == name);
    }
}