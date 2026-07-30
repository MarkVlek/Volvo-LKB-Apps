import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CarModel } from 'src/app/pages/accessories/car.model';

@Component({
  selector: 'accessories-modal',
  templateUrl: './accessories-modal.component.html',
  styleUrls: ['./accessories-modal.component.scss']
})
export class AccessoriesModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AccessoriesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {carModel: CarModel},
  ) { }

  ngOnInit(): void {
  }

  
  yearChosen(year){
    this.dialogRef.close(year);
  }

}
