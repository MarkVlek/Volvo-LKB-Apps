import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_TO_NODE } from '../constants';
import { AccessoriesCategory } from '../pages/accessories/accessories-category.model';
import { AccessoriesProduct } from '../pages/accessories/accessories-product.model';
import { CarModel, ModelCodes } from '../pages/accessories/car.model';
import { getSpecificationByTokenGraphQLQueryV2 } from "./delivery/delivery.quaries";

@Injectable({
  providedIn: 'root'
})
export class AccessoriesService {

  categoriUrl: string;
  productsUrl: string;
  categories: AccessoriesCategory[] = []
  lastAccessorySelected: string;

  constructor(private http: HttpClient) { }

  getSpecificationByTokenGraphQL(regNr: any) {

    let headers = new HttpHeaders();
    headers = headers.append("apollographql-client-name", "<name>");
    headers = headers.append("Content-Type", "application/json");

    return this.http.post('https://graph.volvocars.com/graphql', JSON.stringify(getSpecificationByTokenGraphQLQueryV2(regNr, "sv-SE")), { headers: headers});
  }

  getCategories(): Observable<AccessoriesCategory[]> {
    this.categoriUrl = URL_TO_NODE + 'api/volvoAccessory';
    return this.http.get<AccessoriesCategory[]>(this.categoriUrl);
  }

  getCategory(categoryName): Observable<AccessoriesCategory> {
    this.categoriUrl = URL_TO_NODE + 'api/volvoAccessory/category';
    return this.http.get<AccessoriesCategory>(this.categoriUrl, { params: { categoryName: categoryName } });
  }

  getProductsForCategoryAndCar(categoryName: string, carModel: string) {
    let url = URL_TO_NODE + 'api/volvoproduct';
    return this.http.get<AccessoriesProduct[]>(url);
  }

  getProduct(productName: string, categoryName: string, carModel: CarModel): Observable<any> {
    let url = URL_TO_NODE + 'api/volvoproduct/product';
    return this.http.get(url, {
      params: {
        productName: productName,
        categoryName: categoryName,
        carModelCode: carModel.modelCodes[0].code,
        carModelYear: carModel.modelCodes[0].year
      }
    });
  }
}
