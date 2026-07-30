import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { RTCService } from 'src/app/services/rtc.service';
import { RTCItem } from '../pages/reason-to-choose/rtc-models/rtc-item.model';

export const RtcItemsResolver: ResolveFn<RTCItem[]> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const from = decodeURIComponent(route.url[1].path);
        const title = route.params['name']
        return inject(RTCService).getCategoryItemList(from, title);
    };
