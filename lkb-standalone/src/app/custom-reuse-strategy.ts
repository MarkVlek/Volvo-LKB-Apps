import { RouteReuseStrategy } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { LkbComponent } from './pages/leveransklarabilar/lkb/lkb.component';
import { LkbDetailsComponent } from './pages/leveransklarabilar/lkb-details/lkb-details.component';
import { LkbCategoriesComponent } from './pages/leveransklarabilar/lkb-categories/lkb-categories.component';

export class CustomReuseStrategy implements RouteReuseStrategy {
    private storedRouteHandle: DetachedRouteHandle | null = null;
    private shouldReuseLkbComponent = false;

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.component === LkbComponent;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        if (route.component === LkbComponent) {
            this.storedRouteHandle = handle;
        }
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return route.component === LkbComponent && this.storedRouteHandle !== null && this.shouldReuseLkbComponent;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        if (route.component === LkbComponent && this.storedRouteHandle !== null && this.shouldReuseLkbComponent) {
            return this.storedRouteHandle;
        }
        return null;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        const futureComponent = future.firstChild?.component;
        const currentComponent = curr.firstChild?.component;

        if (currentComponent == LkbCategoriesComponent && futureComponent == LkbComponent) {
            this.shouldReuseLkbComponent = false;
            return true;
        }

        if (currentComponent == LkbDetailsComponent && futureComponent == LkbComponent) {
            this.shouldReuseLkbComponent = true;
            return true;
        }

        return false;
    }
}