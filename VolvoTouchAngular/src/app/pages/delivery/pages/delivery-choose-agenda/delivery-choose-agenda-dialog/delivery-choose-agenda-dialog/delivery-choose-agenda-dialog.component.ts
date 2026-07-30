import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DeliveryAgendaService } from 'src/app/pages/delivery/services/delivery-agenda.service';
import { CastingService } from 'src/app/services/casting.service';

@Component({
  selector: 'app-delivery-choose-agenda-dialog',
  templateUrl: './delivery-choose-agenda-dialog.component.html',
  styleUrls: ['./delivery-choose-agenda-dialog.component.scss']
})
export class DeliveryChooseAgendaDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeliveryChooseAgendaDialogComponent>);

  constructor() { }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
