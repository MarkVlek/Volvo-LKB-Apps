import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageCard } from './enums/page-card-enum';
import { RouterAnimationEnum } from './enums/router-animation.enum';
import { AccessoriesCategoryDetailsComponent } from './pages/accessories/accessories-category-details/accessories-ategory-details.component';
import { AccessoriesCategoryComponent } from './pages/accessories/accessories-category/accessories-category.component';
import { AccessoriesProductComponent } from './pages/accessories/accessories-product/accessories-product.component';
import { AccessoriesComponent } from './pages/accessories/accessories/accessories.component';
import { AccessoriesCartComponent } from './pages/accessories/cart/accessories-cart.component';
import { OrderDoneComponent } from './pages/accessories/cart/order-done/order-done.component';
import { BlankComponent } from './pages/blank/blank.component';
import { BdvComponent } from './pages/iframes/bdv/bdv.component';
import { CareByVolvoComponent } from './pages/iframes/care-by-volvo/care-by-volvo.component';
import { ElectrificationComponent } from './pages/iframes/electrification/electrification.component';
import { EnvironmentComponent } from './pages/environment/environment.component';
import { LkbCategoriesComponent } from './pages/leveransklarabilar/lkb-categories/lkb-categories.component';
import { LkbDetailsComponent } from './pages/leveransklarabilar/lkb-details/lkb-details.component';
import { LkbComponent } from './pages/leveransklarabilar/lkb/lkb.component';
import { RTCCatagoryViewComponent } from './pages/reason-to-choose/rtc-category-view/rtc-category-view.component';
import { ScreensaverComponent } from './pages/screensaver/screensaver.component';
import { LkbResolver } from './services/resolvers/leveransklaraBilarResolver';
import { ElectrificationChannelComponent } from './pages/electrification/electrification-channel/electrification-channel.component';
import { ECategoryComponent } from './pages/electrification/e-category/e-category.component';
import { RtcItemsMainViewComponent } from './pages/reason-to-choose/rtc-items-main-view/rtc-items-main-view.component';
import { RtcItemsResolver } from './resolvers/rtc-items.resolver';
import { DeliveryStartComponent } from './pages/delivery/pages/delivery-start/delivery-start.component';
import { DeliveryComponent } from './pages/delivery/pages/delivery/delivery.component';
import { DeliveryChooseAgendaComponent } from './pages/delivery/pages/delivery-choose-agenda/delivery-choose-agenda.component';
import { DeliveryMainOverviewComponent } from './pages/delivery/pages/delivery-main-overview/delivery-main-overview.component';
import { DeliveryMainItemViewComponent } from './pages/delivery/pages/delivery-main-item-view/delivery-main-item-view.component';
import { DeliveryMainItemViewSurfaceComponent } from './pages/delivery/pages/delivery-main-item-view-surface/delivery-main-item-view-surface.component';
import { OndemandComponent } from './pages/iframes/ondemand/ondemand.component';
import { FabfComponent } from './pages/iframes/fabf/fabf.component';
import { ShopComponent } from './pages/iframes/shop/shop.component';
import { TestDriveComponent } from './pages/iframes/test-drive/test-drive.component';
import { ElectrificationOnlyComponent } from './pages/electrification-only/electrification-only.component';
import { ShopIframeComponent } from './pages/iframes/shop-iframe/shop-iframe.component';
import { DeliveryKistaComponent } from './pages/delivery/pages/delivery-kista/delivery-kista.component';
import { DeliveryMainItemViewVcsComponent } from './pages/delivery/pages/delivery-main-item-view-vcs/delivery-main-item-view-vcs/delivery-main-item-view-vcs.component';
import { DeliveryModelSelectorComponent } from './pages/delivery/pages/delivery-model-selector/delivery-model-selector/delivery-model-selector.component';
import { OffersComponent } from './pages/iframes/offers/offers.component';
import { LaunchComponent } from './pages/iframes/launch/launch.component';
import { Ex60LandingComponent } from './pages/ex60/ex60-landing/ex60-landing.component';
import { Ex60LeasingComponent } from './pages/ex60/ex60-leasing/ex60-leasing.component';
import { ElectrificationIframeComponent } from './pages/iframes/electrification-iframe/electrification-iframe.component';
import { Ex60App } from './pages/ex60/ex60-app/ex60-app';


const routes: Routes = [
  { path: PageCard.Blank, component: BlankComponent },
  {
    path: PageCard.Bygg_din_Volvo, component: BdvComponent,
    data: { animationState: RouterAnimationEnum.ByggDinVolvo }
  },
  {
    path: PageCard.Care_by_Volvo, component: CareByVolvoComponent,
    data: { animationState: RouterAnimationEnum.CareByVolvo }
  },
  {
    path: PageCard.Leveransklara_Bilar, component: LkbCategoriesComponent,
    data: { animationState: RouterAnimationEnum.LeveransklaraBilarMain }
  },
  {
    path: PageCard.Leveransklara_bilarcategory, component: LkbComponent,
    data: { animationState: RouterAnimationEnum.LeveransklaraBilarFilterSerach }
  },
  {
    path: PageCard.Leveransklara_bilar_detail, component: LkbDetailsComponent,
    data: { animationState: RouterAnimationEnum.LeveransklaraBilarDetails }
  },
  {
    path: PageCard.RTCCategoryList + "/:page", component: RTCCatagoryViewComponent,
    data: { animationState: RouterAnimationEnum.RTCCategoryList }
  },
  {
    path: PageCard.RTCItemList + "/:page/:name/:item", component: RtcItemsMainViewComponent,
    data: { animationState: RouterAnimationEnum.RTCItemList },
    resolve: { items: RtcItemsResolver }
  },
  {
    path: PageCard.Environment, component: EnvironmentComponent,
    data: { animationState: RouterAnimationEnum.Environment }

  },
  { path: PageCard.Screensaver, component: ScreensaverComponent },
  {
    path: PageCard.Sök_Tillbehör,
    component: AccessoriesComponent,
    data: { animationState: RouterAnimationEnum.Accessories }
  },
  {
    path: PageCard.AccessoriesCategory + "/:car/:year",
    component: AccessoriesCategoryComponent,
    data: { animationState: RouterAnimationEnum.AccessoriesCategory }
  },
  {
    path: PageCard.AccessoriesCategoryDetails + "/:category/:car/:year",
    component: AccessoriesCategoryDetailsComponent,
    data: { animationState: RouterAnimationEnum.AccessoriesCategoryDetails }
  },
  {
    path: PageCard.AccessoriesProduct + "/:category/:accessory/:car/:year",
    component: AccessoriesProductComponent,
    data: { animationState: RouterAnimationEnum.AccessoriesProduct }
  },
  {
    path: PageCard.Cart,
    component: AccessoriesCartComponent,
    data: { animationState: RouterAnimationEnum.Cart }
  },
  {
    path: PageCard.OrderDone,
    component: OrderDoneComponent,
    data: { animationState: RouterAnimationEnum.OrderDone }
  },
    {
    path: PageCard.ElectrificationIframe, 
    component: ElectrificationIframeComponent,
    data: { animationState: RouterAnimationEnum.Electrification }
  },
  {
    path: PageCard.Electrification,
    component: ElectrificationComponent,
    data: { animationState: RouterAnimationEnum.Electrification }
  },
  {
    path: PageCard.ElectrificationOnly,
    component: ElectrificationOnlyComponent,
    data: { animationState: RouterAnimationEnum.Electrification }
  },
  {
    path: PageCard.ElectrificationCategories + "/:name",
    component: ECategoryComponent,
    data: { animationState: RouterAnimationEnum.ElectrificationCategories }
  },
  {
    path: PageCard.Delivery,
    component: DeliveryComponent,
  },
  {
    path: PageCard.Delivery  + "/:noreg/:screensaver",
    component: DeliveryComponent,
  },
  {
    path: PageCard.DeliveryStart,
    component: DeliveryStartComponent,
  },
  {
    path: PageCard.DeliveryStart + "/:noreg",
    component: DeliveryStartComponent,
  },
  {
    path: PageCard.DeliveryChooseAgenda,
    component: DeliveryChooseAgendaComponent,
  },
  {
    path: PageCard.DeliveryMainOverView,
    component: DeliveryMainOverviewComponent,
  },
  {
    path: PageCard.DeliveryMainItemView,
    component: DeliveryMainItemViewComponent,
  },
    {
    path: PageCard.DeliveryMainItemViewvcs,
    component: DeliveryMainItemViewVcsComponent,
  },
  {
    path: PageCard.DeliveryMainItemViewSurface,
    component: DeliveryMainItemViewSurfaceComponent,
  },
  {
    path: PageCard.DeliveryKista,
    component: DeliveryKistaComponent,
  },
    {
    path: PageCard.DeliveryModelSelector,
    component: DeliveryModelSelectorComponent,
  },
  {
    path: PageCard.OnDemand,
    component: OndemandComponent,
    data: { animationState: RouterAnimationEnum.OnDemand }
  },
  {
    path: PageCard.Fabf,
    component: FabfComponent,
    data: { animationState: RouterAnimationEnum.Fabf }
  },
  {
    path: PageCard.Shop,
    component: ShopComponent,
    data: { animationState: RouterAnimationEnum.Shop }
  },
  {
    path: PageCard.TestDrive,
    component: TestDriveComponent,
    data: { animationState: RouterAnimationEnum.TestDrive }
  },
  {
    path: PageCard.Offers,
    component: OffersComponent,
    data: { animationState: RouterAnimationEnum.Offers }
  },
  {
    path: PageCard.LaunchIframe,
    component: LaunchComponent,
    data: { animationState: RouterAnimationEnum.LaunchIframe }
  },
  {
    path: PageCard.EX60, component: Ex60LandingComponent,
    data: { animationState: RouterAnimationEnum.EX60Main }
  },
  {
    path: PageCard.EX60_Leasing, component: Ex60LeasingComponent,
    data: { animationState: RouterAnimationEnum.EX60leasing }
  },
    {
    path: PageCard.EX60_App, component: Ex60App,
    data: { animationState: RouterAnimationEnum.Ex60App }
  },
  // TODO THIS NEEDS TO BE LAST OTHERWISE IT OVERRIDES CURRENT PATH.
  // FIX LOOK FOR BETTER SOLUTION
  { path: '**', component: BlankComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
