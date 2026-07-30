import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from 'src/app/modules/material.module';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared.module';
import { ElectrificationChannelComponent } from './electrification-channel/electrification-channel.component';
import { ECategoryComponent } from './e-category/e-category.component';
import { EItemViewComponent } from './e-item-view/e-item-view.component';



@NgModule({
  declarations: [
    ElectrificationChannelComponent,
    ECategoryComponent,
    EItemViewComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MaterialModule,
    RouterOutlet,
    SharedModule
  ],
  exports: [
  ]
})
export class ElectrificationModule { }
