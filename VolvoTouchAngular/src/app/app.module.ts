import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PageSelectorComponent } from './components/page-selector/page-selector.component';
import { PageCardComponent } from './components/page-card/page-card.component';
import { ConfigService } from './services/config.service';
import { RemoveUnderScorePipe } from './pipes/replace-underscore.pipe';
import { NavigationService } from './services/navigation.service';
import { BackComponent } from './components/back/back.component';
import { BackendService } from './services/backend.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { ScreensaverComponent } from './pages/screensaver/screensaver.component';
import { ScreenSaverTimerService } from './services/screen-saver-timer.service';
import { ContinueTimerService } from './services/continue-timer.service';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './services/reuse-strategy.service';
import { IframeService } from './services/iframe.service';
import { PinchZoomDirective } from './directives/pinch-zoom.directive';
import { RTCService } from './services/rtc.service';
import { ReplaceLineBreaks } from './pipes/line-break.pipe';
import { ScreensaverService } from './services/screen-saver.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LkbResolver } from './services/resolvers/leveransklaraBilarResolver';

import { SearchWrapperComponent } from './components/search-wrapper/search-wrapper.component';
import { FilterSearchComponent } from './components/filter-search/filter-search.component';
import { RTCFilterPipe } from './pipes/RTCFilter.pipe';
import { FilterSearchItemComponent } from './components/filter-search-item/filter-search-item.component';
import { SearchBarService } from './services/search-bar.service';
import { CreateMatrixService } from './services/create-matrix.service';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { LkbService } from './services/lkb.service';
import { TokenService } from './services/token.service';
import { StatisticService } from './services/Statistics/statistics.service';
import { AnalyticsService } from './services/analytics/analytics.service';
import { IframeKeyBoardService } from './services/Iframe-keyboard.service';
import { PinchgifService } from './services/pinchgif.service';
import { EnvironmentModule } from './pages/environment/environment.module';
import { CommonModule } from '@angular/common';
import { DeliveryModule } from './pages/delivery/delivery.module';
import { RouterModule } from '@angular/router';
import { BlankModule } from './pages/blank/blank.module';
import { AccessoriesModule } from './pages/accessories/accessories.module';
import { LkbModule } from './pages/leveransklarabilar/leveransklarabilar.module';
import { ModalModule } from './modules/modals.module';
import { RtcModule } from './pages/reason-to-choose/reason-to-choose.module';
import { SharedModule } from './modules/shared.module';
import { ConfigErrorService } from './services/config-error-timer.service';
import { ScreenRefreshService } from './services/screenRefreshService';
import { IFrameModule } from './pages/iframes/iframe.module';
import { CastComponent } from './components/cast/cast.component';
import { ImagePreloadService } from './services/image-preload.service';
import { ElectrificationModule } from './pages/electrification/electrification.module';
import { ElectrificationService } from './services/electrification.service';
import { ElectrificationOnlyComponent } from './pages/electrification-only/electrification-only.component';
import { AdminComponent } from './components/admin/admin.component';
import { launchPageAliasPipe } from './pipes/launch-page-alias.pipe';
import { LanguageService } from './services/language.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageDialogComponent } from './components/language-dialog/language-dialog.component';
import { SelectedSalePersonComponent } from './components/sales-person/selected-sale-person/selected-sale-person/selected-sale-person.component';
import { SalesPersonService } from './components/sales-person/services/sales-selector.service';
import { EnergySaverComponent } from './energy-saver/energy-saver.component';
import { Ex60LandingComponent } from './pages/ex60/ex60-landing/ex60-landing.component';
import { Ex60CategoryImageComponent } from './pages/ex60/ex60-category-image/ex60-category-image.component';
import { Ex60LeasingComponent } from './pages/ex60/ex60-leasing/ex60-leasing.component';
import { QRCodeModule } from "angularx-qrcode";
import { Ex60App } from './pages/ex60/ex60-app/ex60-app';


@NgModule({
  declarations: [
    AppComponent,
    ReplaceLineBreaks,
    FooterComponent,
    HeaderComponent,
    PageSelectorComponent,
    PageCardComponent,
    BackComponent,
    CastComponent,
    SearchWrapperComponent,
    ScreensaverComponent,
    PinchZoomDirective,
    RTCFilterPipe,
    RemoveUnderScorePipe,
    launchPageAliasPipe,
    FilterSearchComponent,
    FilterSearchItemComponent,
    ElectrificationOnlyComponent,
    AdminComponent,
    LanguageDialogComponent,
    SelectedSalePersonComponent,
    EnergySaverComponent,
    Ex60LandingComponent,
    Ex60CategoryImageComponent,
    Ex60LeasingComponent,
    Ex60App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    EnvironmentModule,
    ElectrificationModule,
    CommonModule,
    DeliveryModule,
    RouterModule,
    BlankModule,
    AccessoriesModule,
    LkbModule,
    ModalModule,
    RtcModule,
    IFrameModule,
    SharedModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    QRCodeModule
],
  providers: [
    ConfigService,
    NavigationService,
    BackendService,
    ScreenSaverTimerService,
    ContinueTimerService,
    IframeService,
    RTCService,
    ScreensaverService,
    LkbService,
    SearchBarService,
    CreateMatrixService,
    LkbResolver,
    TokenService,
    StatisticService,
    AnalyticsService,
    IframeKeyBoardService,
    PinchgifService,
    ConfigErrorService,
    ScreenRefreshService,
    ImagePreloadService,
    ElectrificationService,
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    LanguageService,
    SalesPersonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader{
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json')
}
