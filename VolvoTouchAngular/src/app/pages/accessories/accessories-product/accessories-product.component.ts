import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccessoriesService } from 'src/app/services/accessories.service';
import CarModelsService from 'src/app/services/carmodels.service';
import { StatisticService } from 'src/app/services/Statistics/statistics.service';
import { AccessoriesCategory, VolvoAccessory, VolvoAccessoryMedia } from '../accessories-category.model';
import { CarModel } from '../car.model';

@Component({
  selector: 'accessories-product',
  templateUrl: './accessories-product.component.html',
  styleUrls: ['./accessories-product.component.scss']
})
export class AccessoriesProductComponent implements OnInit {
  selectedAccessory: VolvoAccessory;
  selectedCarModel: CarModel;
  selectedCategory: AccessoriesCategory;
  panelOpenState = true;
  addedToCart: boolean = false;
  mainImage: string;
  IsVideo: boolean = false

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessoriesService: AccessoriesService,
    private carModelsService: CarModelsService,
    private statisticsService: StatisticService
  ) { }

  ngOnInit(): void {
    this.addedToCart = false;
    let categoryName = this.activatedRoute.snapshot.params["category"];
    let accessoryName = this.activatedRoute.snapshot.params["accessory"];
    let carTitle = this.activatedRoute.snapshot.params["car"];
    let carModelYear = Number(this.activatedRoute.snapshot.params["year"]);
    this.getAccessory(categoryName, accessoryName, carTitle, carModelYear);
    
    const videoMedia = this.selectedAccessory.medias.find(media => media.filePath.includes('.mp4'));
    if (videoMedia) {
      this.mainImage = videoMedia.filePath;
      this.IsVideo = true;
    } else {
      this.mainImage = this.selectedAccessory.medias.at(0).filePath;
      this.IsVideo = false;
    }
  }

  getAccessory(categoryName: string, accessoryName: string, carTitle: string, carModelYear: number) {

    this.selectedCarModel = this.carModelsService.getCarModelByNameAndYear(carTitle, carModelYear)

    if(!categoryName.includes("Alla")) {
      this.selectedCategory = this.accessoriesService.categories.find(x => x.name == categoryName)
      this.selectedAccessory = this.selectedCategory.accessories.find(x => x.name == accessoryName && x.carModel == carTitle)
    }
    else 
      this.selectedAccessory = this.accessoriesService.categories.flatMap(x => x.accessories).find(x => x.name == accessoryName && x.carModel == carTitle)

    if (this.selectedAccessory && this.selectedAccessory.medias) {
      this.selectedAccessory.medias = this.selectedAccessory.medias.sort((a, b) => {
        const aIsVideo = a.filePath.includes('.mp4');
        const bIsVideo = b.filePath.includes('.mp4');

        if (aIsVideo && !bIsVideo) return -1;
        if (!aIsVideo && bIsVideo) return 1;
        return 0;
      });
    }
  }

  imagePicked(media :VolvoAccessoryMedia) {
    this.IsVideo = media.filePath.includes('.mp4') 
    this.mainImage = media.filePath;
  }

}
