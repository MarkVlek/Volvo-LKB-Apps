import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { AccessoriesCategory, VolvoAccessory } from '../accessories-category.model';
import { AccessoriesProduct } from '../accessories-product.model';
import { CarModel } from '../car.model';
import { AccessoriesService } from 'src/app/services/accessories.service';
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-accessories-product-box',
  templateUrl: './accessories-product-box.component.html',
  styleUrls: ['./accessories-product-box.component.scss']
})
export class AccessoriesProductBoxComponent implements OnInit {
  @Input() accessory: VolvoAccessory;
  @Input() selectedCarModel: CarModel;
  @Input() selectedCategory: AccessoriesCategory;
  image: string;
  shortDescription: String = ""
  
  constructor(private router: Router, private accessoriesService: AccessoriesService) { }

  ngOnInit(): void {

    this.image = this.accessory.medias.find(media => media.filePath.includes('.jpg')).filePath
    this.shortDescription = this.accessory.description.split(".")[0]

  }


  onClick() {

    this.accessoriesService.lastAccessorySelected = this.accessory.name;

    this.router.navigate([
      PageCard.AccessoriesProduct,
      this.selectedCategory.name,
      this.accessory.name,
      this.selectedCarModel.title,
      this.selectedCarModel.modelCodes[0].year]);
      
  }

}
