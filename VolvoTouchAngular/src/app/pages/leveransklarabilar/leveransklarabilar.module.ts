import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LkbFilterButtonComponent } from 'src/app/components/lkb-filter-button/lkb-filter-button.component';
import { LkbSliderComponent } from 'src/app/components/lkb-slider/lkb-slider.component';
import { NumberPadComponent } from 'src/app/components/number-pad/number-pad.component';
import { MaterialModule } from 'src/app/modules/material.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { SwiperModule } from 'swiper/angular';
import { LkbCarCardComponent } from './lkb-car-card/lkb-car-card.component';
import { LkbCategoriesComponent } from './lkb-categories/lkb-categories.component';
import { LkbCategoryImageComponent } from './lkb-category-image/lkb-category-image.component';
import { LkbDetailsComponent } from './lkb-details/lkb-details.component';
import { LkbFilterComponent } from './lkb-filter/lkb-filter.component';
import { LkbFinaceBoxComponent } from './lkb-finace-box/lkb-finace-box.component';
import { LkbInsuranceComponent } from './lkb-insurance/lkb-insurance.component';
import { LkbResultviewComponent } from './lkb-resultview/lkb-resultview.component';
import { LkbSwiperViewComponent } from './lkb-swiper-view/lkb-swiper-view.component';
import { LkbComponent } from './lkb/lkb.component';
import { ChangeInterestModalComponent } from '../../modals/change-interest-modal/change-interest-modal.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LkbCheckMissingNamePipe } from 'src/app/pipes/lkb-check-missing-name.pipe';
import { LkbDealerNamePipe } from 'src/app/pipes/lkb-dealer-name.pipe';
import { PostalcodePipe } from 'src/app/pipes/postal-code.pipe';


@NgModule({
    declarations: [
        LkbComponent,
        LkbCarCardComponent,
        LkbCategoriesComponent,
        LkbDetailsComponent,
        LkbFilterComponent,
        LkbFinaceBoxComponent,
        LkbInsuranceComponent,
        LkbResultviewComponent,
        LkbSwiperViewComponent,
        LkbCategoryImageComponent,
        LkbFilterButtonComponent,
        LkbSliderComponent,
        NumberPadComponent,
        ChangeInterestModalComponent,
        LkbCheckMissingNamePipe,
        LkbDealerNamePipe,
        PostalcodePipe
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        MaterialModule,
        SharedModule,
        SwiperModule,
        InfiniteScrollModule
    ],
    exports: [
        LkbComponent,
        LkbCarCardComponent,
        LkbCategoriesComponent,
        LkbDetailsComponent,
        LkbFilterComponent,
        LkbFinaceBoxComponent,
        LkbInsuranceComponent,
        LkbResultviewComponent,
        LkbSwiperViewComponent,
        LkbCategoryImageComponent,
        LkbFilterButtonComponent,
        LkbSliderComponent,
        NumberPadComponent
    ]
})

export class LkbModule { }