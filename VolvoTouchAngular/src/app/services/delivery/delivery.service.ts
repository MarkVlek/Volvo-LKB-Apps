import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MultibrandScreensaver } from "src/app/pages/delivery/models/delivery-multibrand.model";
import { DeliverPacks } from "src/app/pages/delivery/models/delivery-packs.model";
import { DeliveryProduct } from "src/app/pages/delivery/models/delivery-products.model";
import { CarByRegistrationNumber } from "src/app/pages/delivery/models/delivery.grapql.model";
import { VolvoDeliveryAgendaCategory } from "src/app/pages/delivery/models/volvo-delivery-agenda-category.model";
import { VolvoDeliveryModelScreensaver } from "src/app/pages/delivery/models/volvo-delivery-modelscreensaver.model";
import { getSpecificationByTokenGraphQLQueryV2, getSpecificationByTokenGraphQLQueryV3 } from "./delivery.quaries";

@Injectable({
    providedIn: 'root',
})
export class DeliveryService {
    urlToNode = "http://localhost:3000/";
    count: number = 0;

    //#region  CAR
    public car: CarByRegistrationNumber;
    public keyID: string;
    public xSession: string;
    public token: any;
    public regNum: string;
    //#endregion

    //#region Screensaves
    public modelScreensavers: VolvoDeliveryModelScreensaver[] = [];
    //#endregion

    //#region AGENDA
    ownership: VolvoDeliveryAgendaCategory[] = [];
    exterior: VolvoDeliveryAgendaCategory[] = [];
    interior: VolvoDeliveryAgendaCategory[] = [];
    agendaItems: VolvoDeliveryAgendaCategory[] = [];
    //#endregion

    //#region EXTRA
    allProducts: DeliveryProduct[] = [];
    allPacks: DeliverPacks[] = [];
    matchingProducts: DeliveryProduct[] = [];
    allCarProducts: string[] = [];
    multibrandScreensaver: MultibrandScreensaver[];
    dragkrokItems = [{ id: "12405" }, { id: "12425" }, { id: "12446" }, { id: "A00463" }, { id: "001028" }, { id: "A00273" }, { id: "A00276" }];
    innovationsWithProducts: VolvoDeliveryAgendaCategory[] = [];
    //#endregion

    constructor(private http: HttpClient) { }

    getSpecificationByTokenGraphQL(regNr: any) {

        let headers = new HttpHeaders();
        headers = headers.append("apollographql-client-name", "Grassfish-VDRE");
        headers = headers.append("Content-Type", "application/json");

        return this.http.post('https://graph.volvocars.com/graphql', JSON.stringify(getSpecificationByTokenGraphQLQueryV2(regNr, "sv-SE")), { headers: headers});
    }

    getSpecificationByVinGraphQL(vin: any) {

        let headers = new HttpHeaders();
        headers = headers.append("apollographql-client-name", "Grassfish-VDRE");
        headers = headers.append("Content-Type", "application/json");

        return this.http.post('https://graph.volvocars.com/graphql', JSON.stringify(getSpecificationByTokenGraphQLQueryV3(vin, "sv-SE")), { headers: headers});
    }

    //#endregion

    //#region LOCALHOST REQUESTS
    async getAgendaCategories(): Promise<VolvoDeliveryAgendaCategory[]> {
        let agendaUrl = this.urlToNode + "api/volvoDeliveryAgendaCategories";
        return this.http.get<VolvoDeliveryAgendaCategory[]>(agendaUrl).toPromise();
    }
    
    async getAllModelScreensavers(): Promise<VolvoDeliveryModelScreensaver[]> {
        let screensaverUrl = this.urlToNode + "api/volvoDeliveryModelScreensaver";
        return this.http.get<VolvoDeliveryModelScreensaver[]>(screensaverUrl).toPromise();
    }

    async getAllPacks(): Promise<DeliverPacks[]> {
        let packsUrl = this.urlToNode + "api/volvoDeliveryPacks";
        return this.http.get<DeliverPacks[]>(packsUrl).toPromise();
    }

    async getAllProducts(): Promise<DeliveryProduct[]> {
        let agendaUrl = this.urlToNode + "api/volvoDeliveryProducts";
        return this.http.get<DeliveryProduct[]>(agendaUrl).toPromise();
    }

    async getMultibrandScreensaver(): Promise<MultibrandScreensaver[]> {
        let screensaverUrl = this.urlToNode + "api/volvoDeliveryMultibrand";
        return this.http.get<MultibrandScreensaver[]>(screensaverUrl).toPromise();
    }
    //#endregion

    //#region  EXTERNAL METHODES

    filterAgenda(input: VolvoDeliveryAgendaCategory[]) {
        // Filter the response and store only one of each item in the different lists
        //#region  Filter response
        this.ownership = input.filter(item =>
            item.subheading == "car_ownership", ['sort_order, asc']).
            filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)


        this.interior = input.filter(item =>
            item.subheading == "interior", ['sort_order, asc']).
            filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)


        this.exterior = input.filter(item =>
            item.subheading == "exterior", ['sort_order, asc']).
            filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)
        //#endregion
    }

    getInnovationsWithProducts() {
        this.interior.forEach(item => {
            if (!!item.content_list[0]) {
                this.innovationsWithProducts.push(item);
            }
        })

        this.exterior.forEach(item => {
            if (!!item.content_list[0]) {
                this.innovationsWithProducts.push(item);
            }
        });
    }

    /**
   * Finds the active model screensaver for the Volvo Delivery Model.
   * 
   * @returns {VolvoDeliveryModelScreensaver} - The active model screensaver.
   */
    findActiveModelScreenSaver(): VolvoDeliveryModelScreensaver {
        // Log the list of model screensavers for debugging purposes.
        console.log(this.modelScreensavers);

        // Check if the screensaver's model codes match the car's model code 
        const matchModelAndDelivery = item => item.model_codes.split(", ").includes(this.car.car.carKey.carType)

        // Find a screensaver matching the model code and delivery file name.
        let output = this.modelScreensavers.find(matchModelAndDelivery);

        // If no matching screensaver is found.
        if (!output) {
            // Remove 'CC' from the model description to create a modified version.
            const modelDescription = this.car.car.model.description.value.replace('CC', '');

            // Check if the screensaver's name includes the modified model description
            const matchModelDescriptionAndDelivery = item => item.name.includes(modelDescription)

            // Find a screensaver with the modified model description and delivery file name.
            output = this.modelScreensavers.find(matchModelDescriptionAndDelivery);
        }

        // Return the found active model screensaver.
        return output;
    }

    setProductsToShow(): boolean {
        try {
            this.allCarProducts = [];
            this.matchingProducts.push()

            this.car.car.carKey.options.filter(item => {
                this.allCarProducts.push(item);
            });

            this.car.car.carKey.packages.filter(item => {
                this.allCarProducts.push(item);
            });

            // Filters out duplicate members
            this.allCarProducts = this.allCarProducts.filter((element: any, i: any) => i === this.allCarProducts.indexOf(element));
            
            this.allProducts.filter(product => {
                if (this.allCarProducts.includes(product.id.toString()) || this.allCarProducts.includes(product.a_code)
                    || this.allCarProducts.includes(product.o_code)) {
                    this.matchingProducts.push(product);
                }

                if (product.standard_feature_on_model != null) {
                    if (product.standard_feature_on_model.includes(this.car.car.carKey.carType)) {
                        if (!this.matchingProducts.includes(product)) {
                            this.matchingProducts.push(product);
                        }
                    }
                }
            });

            this.removeCategoriesWithNoMatchingProducts();
        }
        catch (err) {
            return false;
        }
        return true;
    }

    removeCategoriesWithNoMatchingProducts() {
        // Remove duplicate items from matching products
        this.matchingProducts = this.matchingProducts.filter((v, i, a) => a.findIndex(v2 => (v2.name === v.name)) === i);

        // Create a new array with only the product IDs from matching products
        const idList: string[] = this.matchingProducts.map(product => product.id.toString());

        // Filter innovationsWithProducts to only include categories that have at least one matching product
        this.innovationsWithProducts = this.innovationsWithProducts.filter(category => {
            return category.content_list.some(item => idList.includes(item));
        });

        // Filter the content_list property of each category to only include matching products
        this.innovationsWithProducts = this.innovationsWithProducts.map(category => {
            category.content_list = category.content_list.filter(item => idList.includes(item));
            return category;
        });
    }
    //#endregion
}