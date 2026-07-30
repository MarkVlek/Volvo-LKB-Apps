import { AccessoriesCategory } from "./accessories-category.model";
import { CarModel } from "./car.model";

export class AccessoriesProduct {
    _id: string;
    carModels: CarModel[];
    categories: AccessoriesCategory[];
    factText: string;
    factTitle: string;
    hero: string;
    mainText: string;
    price: string;
    priceSuffix: string;
    priceTitle: string;
    regularPrice: string;
    regularPriceSuffix: string;
    technicalText: string;
    technicalTitle: string;
    thumbnail: string;
    title: string;
    year: string;
}