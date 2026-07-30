import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "src/app/modules/material.module";
import { SecondsToTimePipe } from "src/app/pipes/seconds-to-time.pipe";
import { RouterOutlet } from "@angular/router";
import { SharedModule } from "src/app/modules/shared.module";
import { DeliveryStartComponent } from './pages/delivery-start/delivery-start.component';
import { DeliveryComponent } from "./pages/delivery/delivery.component";
import { DeliveryChooseAgendaComponent } from './pages/delivery-choose-agenda/delivery-choose-agenda.component';
import { DeliveryAgendaService } from "./services/delivery-agenda.service";
import { SwiperModule } from "swiper/angular";
import { DeliveryMainOverviewComponent } from './pages/delivery-main-overview/delivery-main-overview.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeliveryMainItemViewComponent } from './pages/delivery-main-item-view/delivery-main-item-view.component';
import { HttpClientModule } from '@angular/common/http';
import { DeliveryPipe } from '../../pipes/delivery.pipe';
import { QRCodeModule } from "angularx-qrcode";
import { DeliveryMainItemViewSurfaceComponent } from './pages/delivery-main-item-view-surface/delivery-main-item-view-surface.component';
import { DeliveryCheckForMediaPipe } from "src/app/pipes/delivery-check-for-media.pipe";
import { CastingService } from "src/app/services/casting.service";
import { DeliveryKistaComponent } from './pages/delivery-kista/delivery-kista.component';
import { DeliveryChooseAgendaDialogComponent } from './pages/delivery-choose-agenda/delivery-choose-agenda-dialog/delivery-choose-agenda-dialog/delivery-choose-agenda-dialog.component';
import { MatDialogModule } from "@angular/material/dialog";
import { BatteryStatusComponent } from "src/app/components/battery-status/battery-status.component";
import { DeliveryMainItemViewVcsComponent } from './pages/delivery-main-item-view-vcs/delivery-main-item-view-vcs/delivery-main-item-view-vcs.component';
import { TruncateAtFirstPeriodPipe } from "src/app/pipes/trauncate-at-first-period.pipe";
import { DeliveryFeaturePipe } from "src/app/pipes/delivery-feature.pipe";
import { DeliveryModelSelectorComponent } from './pages/delivery-model-selector/delivery-model-selector/delivery-model-selector.component';
import { CastingStatusPipe } from "src/app/pipes/casting-status.pipe";

@NgModule({
    declarations: [
        DeliveryComponent,
        SecondsToTimePipe,
        DeliveryStartComponent,
        DeliveryChooseAgendaComponent,
        DeliveryMainOverviewComponent,
        DeliveryMainItemViewComponent,
        DeliveryPipe,
        DeliveryCheckForMediaPipe,
        DeliveryMainItemViewSurfaceComponent,
        DeliveryKistaComponent,
        DeliveryChooseAgendaDialogComponent,
        BatteryStatusComponent,
        DeliveryMainItemViewVcsComponent,
        TruncateAtFirstPeriodPipe,
        DeliveryFeaturePipe,
        DeliveryModelSelectorComponent,
        CastingStatusPipe
    ],
    imports: [
        BrowserModule,
        CommonModule,
        MaterialModule,
        RouterOutlet,
        SharedModule,
        SwiperModule,
        QRCodeModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatDialogModule
    ],
    exports: [
        DeliveryComponent,
        SecondsToTimePipe,
        CastingStatusPipe
    ],
    providers: [
        DeliveryAgendaService,
        CastingService
    ]
})

export class DeliveryModule { }