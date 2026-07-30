import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { SwiperModule } from 'swiper/angular';
import { AccessoriesModalComponent } from '../modals/accessories-modal/accessories-modal.component';
import { ContinueModalComponent } from '../modals/continue-modal/continue-modal.component';
import { FullscreenModalComponent } from '../modals/fullscreen-modal/fullscreen-modal.component';
import { MaterialModule } from './material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        FullscreenModalComponent,
        ContinueModalComponent,
        AccessoriesModalComponent
    ],
    imports: [
        BrowserModule,
        MaterialModule,
        SwiperModule,
        TranslateModule
    ]
})

export class ModalModule { }