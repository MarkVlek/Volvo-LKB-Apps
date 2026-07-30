import { Injectable } from "@angular/core";
import { RTCCategory } from "../pages/reason-to-choose/rtc-models/rtc-category.model";
import { RTCFiltered } from "../pages/reason-to-choose/rtc-models/rtc-filtered.model";
import { RTCItem } from "../pages/reason-to-choose/rtc-models/rtc-item.model";
import { LanguageService } from "./language.service";
import { BehaviorSubject } from "rxjs";
import { BackendService } from "./backend.service";
import { RTCImage } from "../pages/reason-to-choose/rtc-models/rtc-image.model";

@Injectable()
export class RTCService {
    public catagories: RTCCategory[];
    public featureCategories: RTCCategory[];
    public filtered: RTCFiltered[];
    private featureEvent$: BehaviorSubject<
        keyof typeof EVENT | null
    > = new BehaviorSubject(null as keyof typeof EVENT | null);

    constructor(private languageService: LanguageService, private backendService: BackendService) { }



    public getCategoryList(input: string): RTCCategory {
        let output: RTCCategory;
        output = this.catagories.filter(c => c.name == input)[0];
        if (output == undefined) {
            this.catagories.forEach(cat => {
                output = cat.categories.filter(c => c.name == input)[0]
            });
        }
        return output;
    }

    public getFeatureCategoryList(input: string): RTCCategory {
        let output: RTCCategory;
        output = this.featureCategories.filter(c => c.name == input)[0];
        if (output == undefined) {
            this.featureCategories.forEach(cat => {
                output = cat.categories.filter(c => c.name == input)[0]
            });
        }
        return output;
    }

    public getCategoryItemList(category: string, name: string): RTCItem[] {
        return this.getCategoryList(category).categories.filter(c => c.name == name)[0].items
    }

    public getItem(category: string, name: string, item: string): RTCItem {
        return this.getCategoryItemList(category, name).filter(i => i.name == item)[0];
    }

    public getItemNotBasePath(category: string, name: string, item: string) {
        let x = this.getItem(category, name, item);
    }
    public filterCategories(categoryGroups: RTCCategory[]): RTCFiltered[] {

        let filteredProducts: RTCFiltered[] = [];
        categoryGroups.forEach(categroyGroup => {

            if(!categroyGroup.name.includes("Launchevent") && !categroyGroup.name.includes("Tillbehör")) {

                console.log('CategoryGroup is: ' + categroyGroup.name)
                
                categroyGroup.categories.forEach(category => {
    
    
                    if(category.categories != null) {
                        category.categories.forEach(subCategory  => {
                            
                            let products = subCategory.items.flatMap(x => x)

                            products.forEach(product => {
                                filteredProducts.push(new RTCFiltered(categroyGroup.name, category.name, subCategory.name, product.name, product.image));
                            });
                        })
                    }
                    else {
    
                        let products = category.items.flatMap(x => x)
    
                        products.forEach(product => {
                            filteredProducts.push(new RTCFiltered(categroyGroup.name, category.name, '', product.name, product.image));
                        });
                    }
                });
            }

        });

        return filteredProducts;
    }

    public filterFeatureByLocale(apps: any[]) {
        let featuresByLocale: any[] = [];
        let filteredFeatures: any[] = [];
        
        apps.forEach(app => {
            filteredFeatures = app.categories.filter((categories: RTCCategory) => categories.text === this.languageService.getActiveLocale())

            var newApp = {
                name: app.name,
                categories: filteredFeatures
            }

            featuresByLocale.push(newApp);
        })

        return featuresByLocale;
    }

    public getFeatureLanguage(){
        return this.featureEvent$.asObservable();
    }

    public setFeatureLanguage(featureEvent$){
        this.featureEvent$.next(featureEvent$)   
    }

    getGlobalFeatures() {
        this.backendService.getFeatureCategories().subscribe(data => {
            var newCategoryGroup: any;
            var apps: any[] = []

            if (data) {
                for (const app of data) {

                    var categoryGroups: RTCCategory[] = []

                    for (const categoryGroup of app["categories"]) {

                        var featureCategories:RTCCategory[] = [];
                        
                        if(categoryGroup.categories.length == 1) {
                            var features:RTCItem[] = [];

                                for (const featureFeature of categoryGroup.categories[0]["features"]) {
                                    
                                    var featureMedias:RTCImage[] = []
            
                                        for (const featureMedia of featureFeature.featureMedias) {
                                        
                                            var newfeatureMedia = {
                                                default_image: false,
                                                image: featureMedia.name,
                                                image_md5: featureMedia.mD5,
                                            }
                                        
                                            featureMedias.push(newfeatureMedia)
                                        }

                                        const videoMedia = featureMedias.find(m => m.image.endsWith('.mp4'));
                                        const imageMedia = featureMedias.find(m => m.image.endsWith('.jpg'));
            
                                        var newFeature = {
                                            name: featureFeature.name,
                                            text: featureFeature.description,
                                            image_list: featureMedias.filter(m => m.image.includes('.jpg')),
                                            has_loan_calculator: false,
                                            has_leasing_calculator: false,
                                            show_leasing_module: false,
                                            show_private_lease_module: false,
                                            show_business_lease_module: false,
                                            intro: '',
                                            preview_image: '',
                                            preview_image_md5: '',
                                            bullet_list: null,
                                            video: videoMedia ? videoMedia.image : '',
                                            image: imageMedia ? imageMedia.image : '',
                                            video_md5: '',
                                            image_md5: featureMedias[0].image_md5,
                                            original_image: imageMedia.image,
                                            original_image_md5: '',
                                            header1: '',
                                            text1: '',
                                            header2: '',
                                            text2: '',
                                            header3: '',
                                            text3: '',
                                            header4: '',
                                            text4: '',
                                            header5: '',
                                            text5: '',
                                            header6: '',
                                            text6: '',
                                            header7: '',
                                            text7: '',
                                            header8: '',
                                            text8: '',
                                            readmore_url: '',
                                        }
            
                                        features.push(newFeature)
                                        
                                    }

                                newCategoryGroup = {
                                name: categoryGroup.name,
                                items: features,
                                header: '',
                                has_loan_calculator: false,
                                has_leasing_calculator: false,
                                thumbnail: categoryGroup.media.name,
                                hero_video: '',
                                hero_image: categoryGroup.media.name,
                                src: categoryGroup.media.name,
                                text: categoryGroup.locale,
                            }

                            categoryGroups.push(newCategoryGroup)
                        }
                        else {
                            for (const category of categoryGroup["categories"]) {
                            
                                var features:RTCItem[] = [];

                                for (const featureFeature of category["features"]) {
                                    
                                    var featureMedias:RTCImage[] = []
            
                                        for (const featureMedia of featureFeature.featureMedias) {
                                        
                                            var newfeatureMedia = {
                                                default_image: false,
                                                image: featureMedia.name,
                                                image_md5: featureMedia.mD5,
                                            }
                                        
                                            featureMedias.push(newfeatureMedia)
                                        }

                                        const videoMedia = featureMedias.find(m => m.image.endsWith('.mp4'));
                                        const imageMedia = featureMedias.find(m => m.image.endsWith('.jpg'));
            
                                        var newFeature = {
                                            name: featureFeature.name,
                                            text: featureFeature.description,
                                            image_list: featureMedias.filter(m => m.image.includes('.jpg')),
                                            has_loan_calculator: false,
                                            has_leasing_calculator: false,
                                            show_leasing_module: false,
                                            show_private_lease_module: false,
                                            show_business_lease_module: false,
                                            intro: '',
                                            preview_image: '',
                                            preview_image_md5: '',
                                            bullet_list: null,
                                            video: videoMedia ? videoMedia.image : '',
                                            image: imageMedia ? imageMedia.image : '',
                                            video_md5: featureMedias[0].image_md5,
                                            image_md5: featureMedias[0].image_md5,
                                            original_image: imageMedia.image,
                                            original_image_md5: '',
                                            header1: '',
                                            text1: '',
                                            header2: '',
                                            text2: '',
                                            header3: '',
                                            text3: '',
                                            header4: '',
                                            text4: '',
                                            header5: '',
                                            text5: '',
                                            header6: '',
                                            text6: '',
                                            header7: '',
                                            text7: '',
                                            header8: '',
                                            text8: '',
                                            readmore_url: '',
                                        }
            
                                        features.push(newFeature)
                                        
                                    }
                                    var newCategory = {
                                        name: category.name,
                                        items: features,
                                        header: category.name,
                                        categories: null,
                                        has_loan_calculator: false,
                                        has_leasing_calculator: false,
                                        thumbnail: category.media.name,
                                        hero_video: '',
                                        hero_image: category.media.name,
                                        src: category.media.name,
                                        text: null,
                                    }
                                    featureCategories.push(newCategory)
                                }

                                newCategoryGroup = {
                                name: categoryGroup.name,
                                items: null,
                                header: '',
                                categories: featureCategories.sort((a, b) => a.name.localeCompare(b.name)),
                                has_loan_calculator: false,
                                has_leasing_calculator: false,
                                thumbnail: categoryGroup.media.name,
                                hero_video: '',
                                hero_image: categoryGroup.media.name,
                                src: categoryGroup.media.name,
                                text: categoryGroup.locale,
                            }

                            categoryGroups.push(newCategoryGroup)
                        }
                    }
                    
                    var newApp = {
                        name: app.name,
                        categories: categoryGroups
                    }

                    apps.push(newApp)
                }
            }
            var featuresByLocale = this.filterFeatureByLocale(apps)
            
            this.featureCategories = apps;
            this.catagories = featuresByLocale;
        })
    }
}

export enum EVENT {
    locale
}