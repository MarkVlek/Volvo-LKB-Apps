import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import CarModelsService from 'src/app/services/carmodels.service';
import { AccessoriesService } from 'src/app/services/accessories.service';
import { AccessoriesCategory } from '../accessories-category.model';
import { CarModel } from '../car.model';
import { ImagePreloadService } from 'src/app/services/image-preload.service';

export interface Tile {
  background: string;
  text: string;
}

@Component({
  selector: 'bestall-tillbehor-category',
  templateUrl: './accessories-category.component.html',
  styleUrls: ['./accessories-category.component.scss']
})
export class AccessoriesCategoryComponent implements OnInit {
  selectedCarModel: CarModel;
  categories: AccessoriesCategory[];
  tilesRow1: Tile[] = [];
  tilesRow2: Tile[] = [];
  carModel: string = "";

  initTiles() {
    this.tilesRow1 = [];
    this.tilesRow2 = [];
    const total = this.categories.length;
    const row1Count = total <= 3 ? total : Math.ceil(total / 2);

    for (let i = 0; i < total; i++) {
      const tile: Tile = {
        text: this.categories[i].name,
        background: `url(${this.categories[i].media.filePath})`
      };
      if (i < row1Count) {
        this.tilesRow1.push(tile);
      } else {
        this.tilesRow2.push(tile);
      }
    }
  }


  constructor(
    private activatedRoute: ActivatedRoute,
    private accessoriesService: AccessoriesService,
    public carmodelService: CarModelsService,
    private router: Router,
    private imagePreloadService: ImagePreloadService
    ) {}

  ngOnInit(): void {

    
    let carmodel = this.activatedRoute.snapshot.params["car"];

    this.carModel = this.activatedRoute.snapshot.params["car"];

    let carmodelYear = Number(this.activatedRoute.snapshot.params["year"]);

    this.selectedCarModel = this.carmodelService.getCarModelByNameAndYear(carmodel, carmodelYear);

    this.getCategories();
    
  }

  getCategories() {
    this.categories = this.accessoriesService.categories.filter(c => c.accessories.some(x => x.carModel == this.carModel));
    this.categories.forEach(x => {
      try {
        x.media.filePath = this.imagePreloadService.getImage("Accessories" + x.name).src;

      x.accessories.at(0).medias.at(0).filePath = this.imagePreloadService.getImage("Accessories" + x.accessories.at(0).id).src;
      } catch (error) {
        console.log(error);
      }
      

    })

    let accessoriesToExclude = this.carmodelService.getCarModelExclusions(this.carmodelService.selectedCarModel)

    if(accessoriesToExclude && accessoriesToExclude.length > 0) {

      const excludeCodes = new Set(accessoriesToExclude.map(a => a.code));

      this.categories.forEach(category => {
        category.accessories = category.accessories.filter(accessory => 
          !excludeCodes.has(accessory.code)
        );
      });
      
    }
      

    this.initTiles();
  }

  categoryClick(categoryName){
    this.router.navigate([PageCard.AccessoriesCategoryDetails, categoryName, this.selectedCarModel.title, this.selectedCarModel.modelCodes[0].year]);
  }
}
