import { Component, OnInit } from '@angular/core';
import { AccessoriesService } from 'src/app/services/accessories.service';
import CarModelsService from 'src/app/services/carmodels.service';
import { ImagePreloadService } from 'src/app/services/image-preload.service';

@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrls: ['./accessories.component.scss']
})
export class AccessoriesComponent implements OnInit {

  constructor(private accessoriesService: AccessoriesService, private carModelService: CarModelsService, private imagePreloadService: ImagePreloadService) { }

  ngOnInit(): void {
    this.accessoriesService.getCategories().subscribe(categories => {
      this.accessoriesService.categories = categories.sort((a, b) => a.sortOrder - b.sortOrder);;
    });

    this.carModelService.carModels.forEach(car => {

      car.cachedImg = this.imagePreloadService.getImage("Accessories" + car.displayTitle).src

    })
}

}
