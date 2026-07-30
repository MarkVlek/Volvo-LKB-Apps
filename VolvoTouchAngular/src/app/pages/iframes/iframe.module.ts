import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { IframeKeyboardComponent } from "./components/iframe-keyboard/iframe-keyboard.component";
import { IframeKeyboardKeyComponent } from "./components/iframe-keyboard-key/iframe-keyboard-key.component";
import { DynamicIframeComponent } from "./dynamic-iframe/dynamic-iframe.component";
import { MaterialModule } from "../../modules/material.module";
import { BdvIframeComponent } from "./bdv-iframe/bdv-iframe.component";
import { ElectrificationIframeComponent } from "./electrification-iframe/electrification-iframe.component";
import { CareByVolvoIframeComponent } from "./care-by-volvo-iframe/care-by-volvo-iframe.component";
import { SharedModule } from "../../modules/shared.module";
import { CareByVolvoComponent } from "./care-by-volvo/care-by-volvo.component";
import { BdvComponent } from "./bdv/bdv.component";
import { ElectrificationComponent } from "./electrification/electrification.component";
import { OndemandIframeComponent } from './ondemand-iframe/ondemand-iframe.component';
import { OndemandComponent } from './ondemand/ondemand.component';
import { QRCodeModule } from "angularx-qrcode";
import { FabfComponent } from "./fabf/fabf.component";
import { FabfIframeComponent } from "./fabf-iframe/fabf-iframe.component";
import { ShopIframeComponent } from './shop-iframe/shop-iframe.component';
import { ShopComponent } from './shop/shop.component';
import { TestDriveComponent } from './test-drive/test-drive.component';
import { TestDriveIframeComponent } from './test-drive-iframe/test-drive-iframe.component';
import { TranslateModule } from "@ngx-translate/core";
import { OffersComponent } from "./offers/offers.component";
import { OffersIframeComponent } from "./offers-iframe/offers-iframe.component";
import { LaunchIframeComponent } from "./launch-iframe/launch-iframe.component";

@NgModule({
    declarations: [
        IframeKeyboardComponent,
        IframeKeyboardKeyComponent,
        DynamicIframeComponent,
        BdvIframeComponent,
        ElectrificationIframeComponent,
        CareByVolvoIframeComponent,
        CareByVolvoComponent,
        BdvComponent,
        ElectrificationComponent,
        OndemandIframeComponent,
        OndemandComponent,
        FabfComponent,
        FabfIframeComponent,
        ShopIframeComponent,
        ShopComponent,
        TestDriveComponent,
        TestDriveIframeComponent,
        OffersComponent,
        OffersIframeComponent,
        LaunchIframeComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        MaterialModule,
        SharedModule,
        QRCodeModule,
        TranslateModule
    ],
    exports: [
        BdvIframeComponent, 
        ElectrificationIframeComponent, 
        CareByVolvoIframeComponent, 
        DynamicIframeComponent,
        CareByVolvoComponent,
        BdvComponent,
        ElectrificationComponent,
        OndemandIframeComponent,
        OndemandComponent,
        FabfComponent,
        FabfIframeComponent,
        ShopIframeComponent,
        ShopComponent,
        TestDriveComponent,
        TestDriveIframeComponent,
        OffersComponent,
        OffersIframeComponent,
        LaunchIframeComponent
    ]
})

export class IFrameModule { }