import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import CarModelsService from 'src/app/services/carmodels.service';
import { AccessoriesService } from 'src/app/services/accessories.service';
import { CarModel } from '../car.model';
import { AccessoriesCategory, VolvoAccessory } from '../accessories-category.model';

@Component({
  selector: 'accessories-category-details',
  templateUrl: './accessories-category-details.component.html',
  styleUrls: ['./accessories-category-details.component.scss']
})
export class AccessoriesCategoryDetailsComponent implements OnInit, AfterViewInit  {

  public selectedCarModel: CarModel;
  selectedCategory: AccessoriesCategory;
  categories: AccessoriesCategory[] = [];
  accessories: VolvoAccessory[] = [];
  carModel: string = ""

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private carmodelsService: CarModelsService,
    private accessoriesService: AccessoriesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

  }
  
  ngAfterViewInit(): void {

    setTimeout(() => {

      if (this.accessoriesService.lastAccessorySelected) {

        const el = document.getElementById(this.accessoriesService.lastAccessorySelected);
        const container = this.scrollContainer.nativeElement;

        if (el && container) {
          const scrollOffset = el.offsetTop - container.offsetTop - (container.clientHeight / 2) + (el.clientHeight / 2);
          container.scrollTo({ top: scrollOffset });
        }
      }
    }, 0);
  }

  async ngOnInit(): Promise<void> {

    this.carModel = this.activatedRoute.snapshot.params["car"];
    let carmodelYear = Number(this.activatedRoute.snapshot.params["year"]);

    this.selectedCarModel = this.carmodelsService.getCarModelByNameAndYear(this.carModel, carmodelYear)
    this.categories = this.accessoriesService.categories.filter(c => c.accessories.some(x => x.carModel == this.carModel))
    
    let allCategory: AccessoriesCategory = {id: 0 , name: "Alla",  locale: "", sortOrder: -1, media: null, accessories: this.accessoriesService.categories.flatMap(x => x.accessories)}
    this.categories.unshift(allCategory)
    
    let category = this.activatedRoute.snapshot.params["category"];
    
    this.selectedCategory = this.categories.find(x => x.name == category);

    this.accessories = this.selectedCategory.accessories.filter(x => x.carModel == this.carModel)
  }

  categoryDetailsClick(accessory: any) {

    if (accessory.name == this.selectedCategory.name)
      return

    this.router.navigate([
      PageCard.AccessoriesProduct,
      this.selectedCategory.name,
      accessory.name,
      this.selectedCarModel.title,
      this.selectedCarModel.modelCodes[0].year]);
      
  }

  categoryClicked(categoryName: string) {

    this.selectedCategory = this.categories.find(x => x.name == categoryName);
    this.accessories = this.selectedCategory.accessories.filter(x => x.carModel == this.carModel)
    const container = this.scrollContainer.nativeElement;
    container.scrollTo({ top })
  }
  
}
