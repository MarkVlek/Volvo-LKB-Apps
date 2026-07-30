import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccessoriesProduct } from '../pages/accessories/accessories-product.model';
import { CarModel } from '../pages/accessories/car.model';
import { CartItem } from '../pages/accessories/cart-item-model';
import CarModelsService from './carmodels.service';
import { ConfigService } from './config.service';
import { StatisticService } from './Statistics/statistics.service';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  name: string;
  phone: string;

  private url = "https://api:key-31028a5cb66cd81efa01cd7087b05ed7@api.mailgun.net/v3/vertiseit.se/messages";
  private headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic YXBpOmtleS0zMTAyOGE1Y2I2NmNkODFlZmEwMWNkNzA4N2IwNWVkNw=='
  });

  public products: CartItem[] = [];
  public orderDoneProducts: CartItem[] = [];

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private statisticsService: StatisticService) {
    this.resetCart();
  }

  resetCart() {
    this.products = [];
  }

  addProductsToCart(product: AccessoriesProduct, selectedCarModel: CarModel) {
    let exists: boolean = false;
    this.products.forEach(cartProduct => {
      if (cartProduct.carModel == selectedCarModel && cartProduct.product == product) {
        cartProduct.amount++;
        exists = true;
      }
    })
    if (!exists) {
      this.products.push(new CartItem(selectedCarModel, product));
    }
  }

  getProducts() {
    return this.products;
  }

  getFinalPriceAllItems(input: CartItem[]): number {
    let output: number = 0;
    input.forEach(p => {
      output += p.getFinalPrice();
    })
    return output;
  }

  RemoveProduct(index: number) {
    this.products.splice(index, 1)
  }

  async sendEmail(input: CartItem[], phone: string, name: string) {
    let sellerEmail = "";
    sellerEmail = await this.configService.GetSellerEmail();
    // sellerEmail = this.dataService.getConfig("VolvoEndlessAisle_selleremail");
    if (!sellerEmail || sellerEmail == undefined) {
      sellerEmail = "defaultvolvoemail@vertiseit.se"
    }
    let productsBody = "Beställning: <br>";

    input.forEach(carModel => {
      productsBody += "<br>" + "Modell: " + carModel.carModel.title + " År:" + carModel.carModel.modelCodes[0].year + "<br>";
      productsBody += carModel.product.title + "<b> x ";
      productsBody += carModel.amount + "</b> = ";
      productsBody += (carModel.getFinalPrice()) + " kr <br>";
    });

    productsBody += "<br> Ungefärligt totalpris: " + this.getFinalPriceAllItems(input) + " kr";

    let body = {
      from: 'volvoendlessiaisle@vertiseit.se',
      to: sellerEmail,
      subject: 'Ny order från Volvo Endless Aisle',
      html: "Kund: " + name + "<br>Telefonnummer: " + phone + "<br><br>" + productsBody
    }

    this.http.post(this.url, body, {
      headers: this.headers, params: {
        from: 'volvoendlessaisle@vertiseit.se',
        to: sellerEmail,
        subject: 'Ny order från Volvo Endless Aisle',
        html: "Kund: " + name + "<br>Telefonnummer: " + phone + "<br><br>" + productsBody
      }
    }).subscribe();


  }
}
