import { NgModule } from "@angular/core";
import { EnvironmentComponent } from "./environment.component";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { PinchZoomModule } from "src/app/directives/pinch-zoom/pinch-zoom.module";


@NgModule({
    declarations: [
        EnvironmentComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        PinchZoomModule
    ],
    exports: [EnvironmentComponent]

})

export class EnvironmentModule { }