import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { AccessoriesComponent } from "./accessories/accessories.component";
import { AccessoriesCategoryComponent } from "./accessories-category/accessories-category.component";
import { AccessoriesCategoryDetailsComponent } from "./accessories-category-details/accessories-ategory-details.component";
import { AccessoriesModelsComponent } from "./accessories-models/accessories-models.component";
import { AccessoriesProductComponent } from "./accessories-product/accessories-product.component";
import { AccessoriesProductBoxComponent } from "./accessories-product-box/accessories-product-box.component";
import { AccessoriesCartComponent } from "./cart/accessories-cart.component";
import { AccessoriesSearchComponent } from "./accessories-search/accessories-search";
import { CartItemComponent } from "./cart/cart-item/cart-item.component";
import { OrderDoneComponent } from "./cart/order-done/order-done.component";
import { OrderDoneItemComponent } from "./cart/order-done-item/order-done-item.component";
import { MaterialModule } from "src/app/modules/material.module";
import { IncludeKRPipe } from "src/app/pipes/includekr.pipe";
import { RouterOutlet } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/modules/shared.module";

@NgModule({
    declarations: [
        AccessoriesComponent,
        AccessoriesCategoryComponent,
        AccessoriesCategoryDetailsComponent,
        AccessoriesModelsComponent,
        AccessoriesProductComponent,
        AccessoriesProductBoxComponent,
        AccessoriesCartComponent,
        AccessoriesSearchComponent,
        CartItemComponent,
        OrderDoneComponent,
        OrderDoneItemComponent,
        IncludeKRPipe,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        MaterialModule,
        RouterOutlet,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        NgOptimizedImage,
    ],
    exports: [
        AccessoriesComponent,
        AccessoriesCategoryComponent,
        AccessoriesCategoryDetailsComponent,
        AccessoriesModelsComponent,
        AccessoriesProductComponent,
        AccessoriesProductBoxComponent,
        AccessoriesCartComponent,
        AccessoriesSearchComponent,
        CartItemComponent,
        OrderDoneComponent,
        OrderDoneItemComponent,
        IncludeKRPipe,
    ]

})

export class AccessoriesModule { }