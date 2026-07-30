import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { LkbService } from 'src/app/services/lkb.service';
import { Addons, LkbInsurance } from '../models/LkbInsurance';

@Component({
  selector: 'app-lkb-insurance',
  templateUrl: './lkb-insurance.component.html',
  styleUrls: ['./lkb-insurance.component.scss']
})
export class LkbInsuranceComponent implements OnInit {
  @Input() carBrand: string;
  @Input() regNr: string;
  @Input() dealerId: string;
  @Input() waykeBranchId: string;
  @Input() waykeCarId: string;
  onInsurance: boolean;
  miles: number = 500;
  error: boolean = false;

  insuranceError: boolean = false;
  showSpinner: boolean = false;
  insurances: LkbInsurance[] = [];
  chosenAddons: any[] = [];

  @ViewChild('input', { static: false }) input: ElementRef;
  form: FormGroup;
  searchValue: string = "";
  searchValue$: Subject<string> = new Subject<string>();

  constructor(public lkbService: LkbService) { }

  ngOnInit(): void {
    this.lkbService.toggleDrawer$.subscribe(() => {
      this.lkbService.showInsurance = false;
      this.searchValue = ""
      this.input.nativeElement.value = "";
      this.error = false;
    })
    this.onInsurance = false;
  }

  onClose() {
    this.lkbService.toggleDrawer$.next();
    this.searchValue = ""
    this.input.nativeElement.value = "";
    this.error = false;
  }

  onSearch() {
    this.showSpinner = true;

    let drivingDistance = 1;
    const miles = this.miles;
    if (miles > 0 && miles <= 1000) {
      drivingDistance = 1;
    } else if (miles <= 1500) {
      drivingDistance = 2;
    } else if (miles <= 2000) {
      drivingDistance = 3;
    } else if (miles <= 2500) {
      drivingDistance = 4;
    } else {
      drivingDistance = 5;
    }

    let dealerType = "IMF"; // contains “VRF” if brand is Volvo,Renault or Dacia, else it should contain “IMF”

    if (
      this.carBrand.toUpperCase().includes("VOLVO") ||
      this.carBrand.toUpperCase().includes("RENAULT") ||
      this.carBrand.toUpperCase().includes("DACIA")) {
      dealerType = "VRF";
    }

    let body = {
      "CarRegistrationNumber": this.regNr,
      "SocialSecurityNumber": this.searchValue,
      "DrivingDistanceClass": drivingDistance,
      "DealerId": this.dealerId,
      "DealerType": dealerType,
      "CarBrand": this.carBrand,
      "ReturnInsuranceItems": true,
      "ReturnInsuranceDescription": true,
      "AddOns": [
        "p_trygg",
        "p_caren",
        "p_premie_sjrel"
      ]
    }

    let waykeBody = {
      "branchId": this.waykeBranchId,
      "drivingDistance": drivingDistance,
      "socialId": this.searchValue,
      "vehicleId": this.waykeCarId
    }

    of(this.lkbService.getWaykeInsurance(waykeBody).subscribe({
      next: (data) => {
        var insuranceDTO = JSON.parse(data);
        this.insurances = insuranceDTO['response']['insurances']
        this.insuranceError = false;
      },
      error: () => {
        this.insuranceError = true;
        this.lkbService.showInsurance = false;
        this.showSpinner = false;
        this.error = true;
        setTimeout(() => {
          this.error = false;
        }, 5000);
      },
      complete: () => {
        this.insuranceError = false;
        this.lkbService.showInsurance = true;
        this.showSpinner = false;
      }
    }))
  }

  changeMiles(event: number) {
    this.miles = event;
  }

  checkMiles(miles: number) {
    if (miles > 2500) {
      return `${2500}+`
    }
    else return miles;
  }

  chooseAddon(addon: Addons, insurance: LkbInsurance) {
    if (!this.chosenAddons.includes(addon)) {
      this.chosenAddons.push(addon)
      insurance.price = insurance.price += addon.monthlyPrice;
    }
    else {
      var addonToRemove = this.chosenAddons.indexOf(addon);
      this.chosenAddons.splice(addonToRemove, 1)
      insurance.price = insurance.price -= addon.monthlyPrice;
    }
  }

  onKeyClick(value: any) {

    if (value == "back" && this.searchValue != "") {
      this.searchValue = this.searchValue.slice(0, -1);
    }
    else if (value != "back") {

      let twelveFigureSocialSecurity = this.searchValue.startsWith("19") || this.searchValue.startsWith("20")

      if (this.searchValue.length == 13 && twelveFigureSocialSecurity) {
        value = ""
      }
      else if (this.searchValue.length == 11 && !twelveFigureSocialSecurity) {
        value = ""
      }

      this.searchValue += value;

      if (this.searchValue.length == 6 && !twelveFigureSocialSecurity) {
        this.searchValue += "-"
      }
      else if (this.searchValue.length == 8 && twelveFigureSocialSecurity) {
        this.searchValue += "-"
      }

    }

    this.input.nativeElement.value = this.searchValue;
    this.searchValue$.next(this.searchValue);
  }
}
