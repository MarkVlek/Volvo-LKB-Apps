import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { RtcLeasingComponent } from 'src/app/pages/reason-to-choose/rtc-item-views/rtc-finance/rtc-leasing/rtc-leasing.component';
import { SliderComponent } from 'src/app/pages/reason-to-choose/rtc-item-views/rtc-finance/slider/slider.component';
import { MaterialModule } from 'src/app/modules/material.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { SwiperModule } from 'swiper/angular';
import { RTCCatagoryViewComponent } from './rtc-category-view/rtc-category-view.component';
import { RTCCategoryComponent } from './rtc-category/rtc-category.component';
import { RtcItemViewComponent } from './rtc-item-views/rtc-item-view/rtc-item-view.component';
import { RTCItemComponent } from './rtc-item/rtc-item.component';
import { RtcItemsMainViewComponent } from './rtc-items-main-view/rtc-items-main-view.component';
import { RTCChooseItemService } from './services/rtc-choose-item-service';
import { RTCSingleViewService } from './services/rtc-single-view.service';
import { RtcLoanViewComponent } from './rtc-item-views/rtc-loan-view/rtc-loan-view.component';
import { RtcCarpayViewComponent } from './rtc-item-views/rtc-carpay-view/rtc-carpay-view.component';


@NgModule({
    declarations: [
        RTCCategoryComponent,
        RTCCatagoryViewComponent,
        RtcItemViewComponent,
        RTCItemComponent,
        RtcLeasingComponent,
        SliderComponent,
        RtcItemsMainViewComponent,
        RtcLoanViewComponent,
        RtcCarpayViewComponent,

    ],
    imports: [
        BrowserModule,
        MaterialModule,
        SwiperModule,
        SharedModule
    ],
    providers: [
        RTCChooseItemService,
        RTCSingleViewService
    ]

})

export class RtcModule { }