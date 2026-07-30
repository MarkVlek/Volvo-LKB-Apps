import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PageCard } from 'src/app/enums/page-card-enum';
import { AccessoriesService } from 'src/app/services/accessories.service';
import CarModelsService from 'src/app/services/carmodels.service';
import { StatisticService } from 'src/app/services/Statistics/statistics.service';
import { VscloudService } from 'src/app/services/vscloud.service';
import { CustomSnackbarComponent } from '../SnackBar/accessorySnackBar.component';

@Component({
  selector: 'accessories-search',
  templateUrl: './accessories-search.html',
  styleUrls: ['./accessories-search.scss']
})
export class AccessoriesSearchComponent implements OnInit {
  loading = false;
  accassoriesNotAvailible = false;
  notFoundRegNr = false;
  carModels: any = [];
  form: FormGroup;
  searchValue: string = "";
  searchValue$: Subject<string> = new Subject<string>();
  searchWait = false;
  isError = false;
  @ViewChild('search', { static: false }) search: ElementRef;


  constructor(
    private vsccloudService: VscloudService,
    private accessoriesService: AccessoriesService,
    private carModelService: CarModelsService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private statisticsService: StatisticService
  ) { }

  ngOnInit(): void {
    this.carModels = this.carModelService.getCarModels()
    this.form = new FormGroup({
      regnr: new FormControl('', [Validators.required])
    });
  }

  onKeyClick(value: string, isSearch) {


    this.search.nativeElement.placeholder = 'REGNUMMER';


    if (isSearch) {
      if (value == "back" && this.searchValue != "") {
        this.searchValue = this.searchValue.slice(0, -1);
      }
      else if (value != "back") {
        if (value == "Space") {
          console.log('no space')
        } else {
          this.searchValue += value;
        }
      }
      this.search.nativeElement.value = this.searchValue;
    }

  }

  async onSearch() {

    this.searchWait = true;
    const regNumber: string = this.search.nativeElement.value;

    if (regNumber === undefined || regNumber == "" || regNumber.length != 6) {

      this.setErrorMessage('Ej giltigt regnummer');
      this.searchWait = false;
      return;
    }

    await this.accessoriesService.getSpecificationByTokenGraphQL(regNumber).toPromise().then(async (res: any) => {

          if (!!res && !!res.data && !!res.data.carByRegistrationNumber && !!res.data.carByRegistrationNumber.car && !!res.data.carByRegistrationNumber.car.carKey && !!res.data.carByRegistrationNumber.car.carKey.carType) {

            let carModelCode = Number((res.data.carByRegistrationNumber.car.carKey.carType));
            let carModelYear = Number((res.data.carByRegistrationNumber.car.carKey.modelYear));
            let car = this.carModelService.getCarByModelCode(carModelCode, carModelYear);
            this.searchWait = false;

            if (car) {
              this.carModelService.selectedCarModel = car.displayTitle
              this.router.navigate([PageCard.AccessoriesCategory, car.title, car.modelCodes[0].year]);
            } 
            else {
              this.checkErrors();
            }
          }
          else {
            this.checkErrors();
          }

        }
      )

  }

  
  setErrorMessage(message) {
    this.search.nativeElement.value = '';
    this.searchValue = '';
    this.search.nativeElement.placeholder = message;
    this.search.nativeElement.style.setProperty('--placeHolder-color', 'rgba(158, 42, 43, 1)');
  }

  checkErrors() {

    this.searchWait = false;
    this.isError = true;

    this._snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        title: 'Bilmodellen hittades ej',
        message: 'Kontakta en säljare för information om tillbehör för den valda bilmodellen'
      },
      duration: 5000, // optional
      horizontalPosition: 'center',
      panelClass: ['my-custom-snackbar-class'] // optional extra styling
    });

    this._snackBar._openedSnackBarRef.afterDismissed().subscribe(() => {
      this.isError = false;
    });

  }

  onModalClick()  {
    this.isError = false;
    this._snackBar.dismiss()
  }

  
}

