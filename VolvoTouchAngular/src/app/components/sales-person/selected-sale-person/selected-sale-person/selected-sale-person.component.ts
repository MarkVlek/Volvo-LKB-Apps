import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { SalesPersonService } from '../../services/sales-selector.service';
import { SalesPerson } from '../../models/sales-person.model';

@Component({
  selector: 'app-selected-sale-person',
  templateUrl: './selected-sale-person.component.html',
  styleUrls: ['./selected-sale-person.component.scss']
})
export class SelectedSalePersonComponent implements OnInit {
  public configService = inject(ConfigService)
  public salesPersonService = inject(SalesPersonService)
  private cdr = inject(ChangeDetectorRef);

  salesList: SalesPerson[];

  ngOnInit(): void {
    this.salesList = this.configService.GetSalesList();
    console.log(this.salesList)
  }

  onSalesPersonClick(person: SalesPerson): void {
    console.log("CLICKED " + person)

    if (person === this.salesPersonService.current) {
      console.log("HERE")
      this.salesPersonService.changeSalesPerson(null)
    }
    else {
      this.salesPersonService.changeSalesPerson(person)
    }
  }
}