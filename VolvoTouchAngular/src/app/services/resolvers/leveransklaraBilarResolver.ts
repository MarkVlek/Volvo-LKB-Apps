import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { VolvoLeveransklarabilar } from "src/app/pages/leveransklarabilar/models/LkbCategory";
import { LkbService } from "../lkb.service";

@Injectable({ providedIn: 'root' })
export class LkbResolver  {
  constructor(private service: LkbService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<VolvoLeveransklarabilar[]> | Promise<VolvoLeveransklarabilar[]> | any {
    return this.service.getAllCars();
  }
}