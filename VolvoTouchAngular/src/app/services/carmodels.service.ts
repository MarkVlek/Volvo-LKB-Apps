import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { carModelList, exclusionList } from '../data/carmodelsdata';
import { CarModel } from '../pages/accessories/car.model';
import { DeliveryCarModel } from '../data/DeliveryCarModels/car.model';
import { deliveryCarModelList } from '../data/DeliveryCarModels/DeliveryCarModelsData';

@Injectable({
  providedIn: 'root'
})
export default class CarModelsService {
  selectedCarModel: any = [];
  carModels: CarModel[] = [];
  deliveryCarModels: DeliveryCarModel[] = []

  constructor(private http: HttpClient) {
    this.carModels = carModelList;
    this.deliveryCarModels = deliveryCarModelList;
  }

  getCarModelByNameAndYear(carModelTitle: string, carModelYear: number) {


    let tempCarModel = this.carModels.find(x => x.title == carModelTitle);
    let tempCarModelCodes = tempCarModel.modelCodes.find(x => x.year == carModelYear);
    var newCarModel: CarModel = {
      title: tempCarModel.title,
      displayTitle: tempCarModel.displayTitle,
      img: tempCarModel.img,
      cachedImg: "",
      modelCodes: [{ year: tempCarModelCodes.year, code: tempCarModelCodes.code }]
    }
    return newCarModel;
  }

  getCarByModelCode(modelCode: number, modelYear: number) {
    let tempCarModel = this.carModels.find(x => x.modelCodes.find(c => c.code == modelCode && c.year == modelYear));

    if(!tempCarModel) {
      return undefined;
    }

    let tempCarModelCodes = tempCarModel.modelCodes.find(x => x.year == modelYear && x.code == modelCode);
    
    var newCarModel: CarModel = {
      title: tempCarModel.title,
      displayTitle: tempCarModel.displayTitle,
      img: tempCarModel.img,
      cachedImg: "",
      modelCodes: [{ year: tempCarModelCodes.year, code: tempCarModelCodes.code }]
    }
    return newCarModel;
  }

  getSelectedCarModel() {
    return this.selectedCarModel;
  }

  getCarModels() {
    return this.carModels;
  }

  getCarModelsDelivery() {
    this.carModels.forEach(x => {
      x.img = "./" +x.img
    }) 

    return this.carModels
  }

  getCarModelExclusions(carModel: string) {
    return exclusionList.filter(x => x.carModel == carModel)
  }

  getDeliveryCarModels() {
    return this.deliveryCarModels;
  }
}


