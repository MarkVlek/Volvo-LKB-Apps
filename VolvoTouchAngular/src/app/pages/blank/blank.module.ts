import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { BlankComponent } from "./blank.component";

@NgModule({
    declarations: [
        BlankComponent
    ],
    imports:[
        BrowserModule,
        CommonModule
    ],
    exports: [BlankComponent]
    
})

export class BlankModule { }