import { AccessoriesProduct } from "./accessories-product.model";
import { CarModel } from "./car.model";

export class CartItem {

    amount: number = 1;
    model: string;
    year: number;
    carModel: CarModel;
    product: AccessoriesProduct

    constructor(carmodel: CarModel, product: AccessoriesProduct) {
        this.carModel = carmodel;
        this.product = product;
        this.model = this.carModel.title;
        this.year = this.carModel.modelCodes[0].year;
    }

    getFinalPrice(): number {
        let outputString:string = "";
        let output: number = 0;

        outputString = this.product.price.split('/')[0];
        outputString = outputString.replace('*', '');
        outputString = outputString.replace('kr','');
        outputString = outputString.replace(' ', '');

        
        for (let i = 0; i < this.amount; i++) {
            output += Number(outputString)
        }
        return output;
    }
 
}