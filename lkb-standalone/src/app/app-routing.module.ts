import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LkbCategoriesComponent } from './pages/leveransklarabilar/lkb-categories/lkb-categories.component';
import { LkbComponent } from './pages/leveransklarabilar/lkb/lkb.component';
import { LkbDetailsComponent } from './pages/leveransklarabilar/lkb-details/lkb-details.component';
import { RouterAnimationEnum } from './enums/router-animation.enum';

// Route path constants extracted from the original PageCard enum (LKB entries only)
export const LKB_ROUTES = {
  CATEGORIES: 'Leveransklara Bilar',
  LIST: 'Leveransklara Bilar category',
  DETAIL: 'Leveransklara Bilar detail',
};

const routes: Routes = [
  { path: '', redirectTo: LKB_ROUTES.CATEGORIES, pathMatch: 'full' },
  { path: LKB_ROUTES.CATEGORIES, component: LkbCategoriesComponent, data: { animationState: RouterAnimationEnum.LeveransklaraBilarMain } },
  { path: LKB_ROUTES.LIST, component: LkbComponent, data: { reuse: true, animationState: RouterAnimationEnum.LeveransklaraBilarFilterSerach } },
  { path: LKB_ROUTES.DETAIL, component: LkbDetailsComponent, data: { animationState: RouterAnimationEnum.LeveransklaraBilarDetails } },
  { path: '**', redirectTo: LKB_ROUTES.CATEGORIES },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
