import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeliveryCarModel } from 'src/app/data/DeliveryCarModels/car.model';
import { PageCard } from 'src/app/enums/page-card-enum';
import CarModelsService from 'src/app/services/carmodels.service';

@Component({
  selector: 'app-delivery-model-selector',
  templateUrl: './delivery-model-selector.component.html',
  styleUrls: ['./delivery-model-selector.component.scss']
})

export class DeliveryModelSelectorComponent implements OnInit {

 carModels: DeliveryCarModel[] = [];

  constructor(private carModelService: CarModelsService, private router: Router) {}

  ngOnInit(): void {
    this.carModels = this.carModelService.getDeliveryCarModels();
  }

  navigate(carModel : DeliveryCarModel): void {
    this.router.navigate([PageCard.Delivery, "noreg", carModel.code], );
  }

  finish() {
    this.router.navigate([PageCard.Delivery]);
  }

} 
