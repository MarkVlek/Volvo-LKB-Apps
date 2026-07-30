import { HttpClient } from "@angular/common/http";
import * as core from "@angular/core";
import { URL_TO_NODE } from "../constants";
import { PageCard } from "../enums/page-card-enum";
import { BackendService } from "./backend.service";
import { RTCService } from "./rtc.service";
import { RTCCategory } from "../pages/reason-to-choose/rtc-models/rtc-category.model";
import { RTCItem } from "../pages/reason-to-choose/rtc-models/rtc-item.model";
import { lastValueFrom } from "rxjs";
import { ElectrificationService } from "./electrification.service";
import { RTCImage } from "../pages/reason-to-choose/rtc-models/rtc-image.model";
import { LanguageService } from "./language.service";
import { SalesPerson } from "../components/sales-person/models/sales-person.model";
import { TranslateService } from "@ngx-translate/core";
import { LkbService } from "./lkb.service";

@core.Injectable()
export class ConfigService {
    public config: {} | undefined;
    public pages: PageCard[] = [];
    public includesReasonToChoose: boolean = false;
    public startPage: string;
    public screenSaverOn: boolean;
    public showSearch: boolean;
    public onlyElectrification: boolean = false;
    public onlyDelivery: boolean = false;
    public lkb: boolean = false;
    public playerName: string;

    constructor(
        private http: HttpClient,
        private rtcService: RTCService,
        private backendService: BackendService,
        private electrificationService: ElectrificationService,
        private languageService: LanguageService,
        private translate: TranslateService) { }

    async FetchConfigs(): Promise<Object> {
        const url = URL_TO_NODE + 'api/config';
        const observable = this.http.get(url);
        const result = await lastValueFrom(observable);
        return result;
    }

    async FetchPlayerName(): Promise<any> {
        const url = URL_TO_NODE + 'api/config/playername';
        const observable = this.http.get(url, {responseType: 'text'});
        const result = await lastValueFrom(observable);
        return result;
    }

    getConfig(name: string): any {
        let value = this.config[name];
        if (value === undefined || value === null) {
            return;
        }
        return value.trim();;
    }

    public async SetConfig(): Promise<boolean> {
        await this.FetchConfigs().then(values => { this.config = values; })
        this.playerName = await this.FetchPlayerName()
        this.pages = await this.AddValuesToPages(this.config);
        this.startPage = await this.SetStartPage();
        // this.showSearch = this.CheckIfSearchShouldExist(this.pages);
        this.screenSaverOn = await this.SetScreensaverOn(this.config);
        return true;
    }

    public async AddValuesToPages(config: {}): Promise<PageCard[]> {
        let output: PageCard[] = [];

        if (config["VolvoEndlessAisle_ElectrificationOnly"]?.toString().toLowerCase() == "true") {
            output.push(PageCard.ElectrificationOnly)
            this.onlyElectrification = true;
            return output;
        }

        if (config["VolvoEndlessAisle_CareByVolvo"]?.toString().toLowerCase() == "true") {
            output.push(PageCard.Care_by_Volvo)
        }
        if (this.config["VolvoEndlessAisle_ByggDinVolvo"]?.toString().toLowerCase() == "true") {
            output.push(PageCard.Bygg_din_Volvo)
            output.push(PageCard.Electrification)
            output.push(PageCard.Offers)
            // output.push(PageCard.LaunchIframe)
            if(this.playerName.toLowerCase().includes("volply137")){
                output.push(PageCard.Delivery)
            }
        }
        if (this.config["VolvoEndlessAisle_Electrification"]?.toString().toLowerCase() == "true") {
            output.push(PageCard.Electrification)
        }
        if (this.config["VolvoEndlessAisle_LeveransklaraBilar"]?.toString().toLowerCase() == "true") {
            this.lkb = true;
            output.push(PageCard.Leveransklara_Bilar)
        }
        if (this.config["VolvoEndlessAisle_ReasonToChoose"]?.toString().toLowerCase() == "true") {
            output.push(PageCard.Innovationer)
            output.push(PageCard.Tjänster)
        }
        if (this.config["VolvoEndlessAisle_EnvironmentalDeclaration"]?.toString().toLowerCase() == "true") {
            output.push(PageCard.Environment)
        }
        if (this.config["VolvoEndlessAisle_ChooseAccesories"]?.toString().toLowerCase() == "true") {
            output.push(PageCard.Sök_Tillbehör)
        }
        if (this.config["VolvoEndlessAisle_Delivery"]?.toString().toLowerCase() == "true") {
            output.push(PageCard.Delivery)
            this.onlyDelivery = true;
            return output;
        }
        if (this.config["VolvoEndlessAisle_Launch"]?.toString().toLowerCase() == "true") {
            output.push(PageCard.Launch)
        }
        if (this.config["VolvoEndlessAisle_Showroom"]?.toString().toLowerCase() == "true") {
            output.push(PageCard.LaunchIframe)
            output.push(PageCard.Shop)
            output.push(PageCard.TestDrive)
            output.push(PageCard.Innovationer)
            output.push(PageCard.Fabf)
            this.rtcService.getGlobalFeatures();

            this.rtcService.getFeatureLanguage().subscribe(event => {
                if (event == 'locale'){
                    this.rtcService.getGlobalFeatures();
                }
            })

        }
        if (this.config["VolvoEndlessAisle_Explorer"]?.toString().toLowerCase() == "true") {
            const activeLanguage = this.GetLanguage();
            this.languageService.setActiveCountry(activeLanguage)
            this.translate.use(activeLanguage);
            output.push(PageCard.Shop)
            output.push(PageCard.TestDrive)
            output.push(PageCard.Bygg_din_Volvo)
        }
        
        if (this.config["VolvoEndlessAisle_Kista"]?.toString().toLowerCase() == "true") {
            output.push(PageCard.Delivery)
        }

        if (this.config["VolvoEndlessAisle_ReasonToChoose"]?.toString().toLowerCase() == "true") {
            this.includesReasonToChoose = true;
            /**
            * Fetch the category applications.
            */
            this.backendService.getCategoryApps().subscribe(data => {
                // Storing the fetched data into a service property
                this.rtcService.catagories = data;

                // Filter the categories and store the result
                this.rtcService.filtered = this.rtcService.filterCategories(this.rtcService.catagories);

                // Check if the specific configuration is set to "true"
                if (this.isElectrificationConfigEnabled()) {
                    // Loop through each category
                    this.rtcService.catagories.forEach((category, categoryIndex) => {
                        // If the category name is "Innovationer", loop through its subcategories
                        if (category.name == "Innovationer") {
                            category.categories.forEach((subcategory, subcategoryIndex) => {
                                // If a subcategory named "Laddskola" is found, log it, store it into the electrification service
                                // and remove it from the original category
                                if (subcategory.name == "Laddskola") {
                                    this.electrificationService.catagories = subcategory;
                                    // Remove the "Laddskola" category from the original array
                                    category.categories.splice(subcategoryIndex, 1);
                                }
                            })
                        }
                    });
                }
                console.log(this.rtcService.catagories);
                // console.log(this.electrificationService.catagories);
                console.log(this.rtcService.filtered)
            })
        }
        return output;
    }

    /**
    * Checks if the electrification configuration is enabled.
    * 
    * @returns {boolean} - Returns true if the configuration is enabled, false otherwise.
    */
    isElectrificationConfigEnabled(): boolean {
        return this.config["VolvoEndlessAisle_Electrification"]?.toString().toLowerCase() == "true";
    }

    createCategory(cat: any) {
        return new RTCCategory(
            cat.name,
            'assets/img/volvo/ReasonToChoose/' + cat.title_image,
            cat.header,
            cat.text,
            cat.hero_image,
            cat.categories,
            cat.items,
            cat.has_loan_calculator,
            cat.thumbnail,
            cat.hero_video,
            cat.has_leasing_calculator
        );
    }

    public CheckIfSearchShouldExist(pages: PageCard[]): boolean {
        if ( pages.includes(PageCard.Tjänster) && pages.includes(PageCard.Innovationer)) {
            return true;
        }
        return false;
    }

    convertStartPage(pageCard: PageCard): string {
        if (pageCard.includes(PageCard.Innovationer) || pageCard.includes(PageCard.Tjänster)) {
            return PageCard.RTCCategoryList + "/" + pageCard;
        }

        return pageCard;
    }

    public async SetStartPage(): Promise<string> {
        if(this.onlyElectrification) {
            return PageCard.ElectrificationOnly;
        }
        let output = PageCard;
        let defaultChannel = this.config["VolvoEndlessAisle_DefaultChannel"]
        for (var name in PageCard) {
            var token = "_";
            var newToken = " ";
            var oldStr = name;
            var newStr = oldStr.split(token).join(newToken);
            if (newStr.toLocaleLowerCase().trim() == defaultChannel.toLocaleLowerCase().trim()) {

                return this.convertStartPage(Object.values(PageCard)[Object.keys(PageCard).indexOf(name)])
            }
        }
        return output.Blank.toString();
    }

    public async downloadRTCJson(pages: PageCard[]): Promise<boolean> {
        if ( pages.includes(PageCard.Innovationer) || pages.includes(PageCard.Tjänster)) {
            return true;
        }
        return false;
    }

    public async SetScreensaverOn(config: {}): Promise<boolean> {
        return config["VolvoEndlessAisle_ScreenSaverOn"]?.toLowerCase() == "true";
    }


    public GetDealerID(): string {
        return this.config["VolvoEndlessAisle_DealerId"];
    }

    public async GetSellerEmail(): Promise<any> {
        return this.config["VolvoEndlessAisle_SellerEmail"];
    }

    public async GetCastingScreenHostName(): Promise<any> {
        return this.config["VolvoEndlessAisle_BdvCastingScreen"]
    }

    public GetCareByVolvoUrl(): string {
        return this.config["VolvoEndlessAisle_CareByVolvoUrl"];
    }

    public GetElectrifcationUrl(): string {
        return `https://gfhvolstorage1.z1.web.core.windows.net/touch?v=${Date.now()}`;
    }

    public GetLaunchIframeUrl(country): string {
        if (country != "")
            return `https://www.volvocars.com/${country}/cars/ex60-electric/`;
        else
            return `https://www.volvocars.com/se/cars/ex60-electric/`;
    }

    public GetOffersUrl(dealerId: string): string {
        return URL_TO_NODE + `/offers/instore/?branchCode=${dealerId}`;
    }

    public GetLKBAllBrandsAvailable(): boolean {
        return this.config["VolvoEndlessAisle_LKBAllBrandsAvailable"]
    }
    
    public GetVolvoInterestRate(): number {
        if(this.config["VolvoEndlessAisle_LKBInterestRate"] != ""){
            return parseFloat(this.config["VolvoEndlessAisle_LKBInterestRate"]);
        }

        return 7.95;
    }

    public GetOnDemandUrl(): string {
        return "https://www.volvocars.com/se/on-demand";
    }

    public GetLanguage(): string {
        return this.config["VolvoEndlessAisle_Language"]?.toLowerCase();
    }

    public GetSalesList(): SalesPerson[] {
        return JSON.parse(this.config["VolvoEndlessAisle_SalesList"])
    }

    public ShouldShowEX60(): boolean {
        const showroom = this.config["VolvoEndlessAisle_Showroom"]?.toString().toLowerCase() === "true";
        const byggDinVolvo = this.config["VolvoEndlessAisle_ByggDinVolvo"]?.toString().toLowerCase() === "true";
        return showroom || byggDinVolvo;
    }
}