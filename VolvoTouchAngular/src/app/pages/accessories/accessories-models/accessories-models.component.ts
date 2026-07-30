import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import CarModelsService from 'src/app/services/carmodels.service';
import { CarModel } from '../car.model';
import { fadeInOut } from 'src/app/animations/deliveryFadeInOut.animation';



@Component({
  selector: 'accessories-models',
  templateUrl: './accessories-models.component.html',
  styleUrls: ['./accessories-models.component.scss'],
  animations: [fadeInOut]
})
export class AccessoriesModelsComponent implements OnInit {
  radius: number = 50;
  public carModels: any = [];
  public carSelected: boolean = false;
  public car: CarModel;

  constructor(
    private router: Router,
    private carModelService: CarModelsService
  ) { }

  ngOnInit(): void {
    this.carModels = this.carModelService.getCarModels();
  }

  carPicked(car: CarModel) {
    this.car = car;
    this.carSelected = true;
    this.carModelService.selectedCarModel = car.displayTitle
    this.router.navigate([PageCard.AccessoriesCategory, this.car.title, 2026]);
  }

  navigate(year: number) {
    console.log(year);
    this.router.navigate([PageCard.AccessoriesCategory, this.car.title, year]);
  }

  return() {
    this.carSelected = false;
    this.car = null;
  }
}
