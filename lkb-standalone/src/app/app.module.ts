import { NgModule } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SwiperModule } from 'swiper/angular';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { CustomReuseStrategy } from './custom-reuse-strategy';
import { RouteReuseStrategy } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './modules/material.module';

// ── LKB pages ────────────────────────────────────────────────────────────────
import { LkbCategoriesComponent } from './pages/leveransklarabilar/lkb-categories/lkb-categories.component';
import { LkbCategoryImageComponent } from './pages/leveransklarabilar/lkb-category-image/lkb-category-image.component';
import { LkbComponent } from './pages/leveransklarabilar/lkb/lkb.component';
import { LkbFilterComponent } from './pages/leveransklarabilar/lkb-filter/lkb-filter.component';
import { LkbResultviewComponent } from './pages/leveransklarabilar/lkb-resultview/lkb-resultview.component';
import { LkbCarCardComponent } from './pages/leveransklarabilar/lkb-car-card/lkb-car-card.component';
import { LkbDetailsComponent } from './pages/leveransklarabilar/lkb-details/lkb-details.component';
import { LkbSwiperViewComponent } from './pages/leveransklarabilar/lkb-swiper-view/lkb-swiper-view.component';
import { LkbFinaceBoxComponent } from './pages/leveransklarabilar/lkb-finace-box/lkb-finace-box.component';
import { LkbInsuranceComponent } from './pages/leveransklarabilar/lkb-insurance/lkb-insurance.component';

// ── Shared components ─────────────────────────────────────────────────────────
import { LkbFilterButtonComponent } from './components/lkb-filter-button/lkb-filter-button.component';
import { LkbSliderComponent } from './components/lkb-slider/lkb-slider.component';
import { NumberPadComponent } from './components/number-pad/number-pad.component';
import { TestKeyComponent } from './components/test-key/test-key.component';
import { BackComponent } from './components/back/back.component';

// ── Modal ─────────────────────────────────────────────────────────────────────
import { ChangeInterestModalComponent } from './modals/change-interest-modal/change-interest-modal.component';

// ── Pipes ─────────────────────────────────────────────────────────────────────
import { LkbDealerNamePipe } from './pages/leveransklarabilar/pipes/lkb-dealer-name.pipe';
import { LkbCheckMissingNamePipe } from './pages/leveransklarabilar/pipes/lkb-check-missing-name.pipe';
import { PostalcodePipe } from './pages/leveransklarabilar/pipes/postal-code.pipe';

// ── Services ──────────────────────────────────────────────────────────────────
import { LkbService } from './services/lkb.service';
import { HarmonyConfigService } from './services/harmony-config.service';
import { NavigationService } from './services/navigation.service';

@NgModule({
  declarations: [
    AppComponent,
    // Pages
    LkbCategoriesComponent,
    LkbCategoryImageComponent,
    LkbComponent,
    LkbFilterComponent,
    LkbResultviewComponent,
    LkbCarCardComponent,
    LkbDetailsComponent,
    LkbSwiperViewComponent,
    LkbFinaceBoxComponent,
    LkbInsuranceComponent,
    // Shared
    LkbFilterButtonComponent,
    LkbSliderComponent,
    NumberPadComponent,
    TestKeyComponent,
    BackComponent,
    // Modals
    ChangeInterestModalComponent,
    // Pipes
    LkbDealerNamePipe,
    LkbCheckMissingNamePipe,
    PostalcodePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    NgOptimizedImage,
    MaterialModule,
    SwiperModule,
    InfiniteScrollModule,
  ],
  providers: [
    LkbService,
    HarmonyConfigService,
    NavigationService,
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
