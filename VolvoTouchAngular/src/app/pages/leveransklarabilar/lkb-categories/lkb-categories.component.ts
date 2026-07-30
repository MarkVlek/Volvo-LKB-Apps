import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { LkbService } from 'src/app/services/lkb.service';
import { LkbCategory } from '../models/LkbCategory';
import { ChangeInterestModalComponent } from '../../../modals/change-interest-modal/change-interest-modal.component';

@Component({
  selector: 'app-lkb-categories',
  templateUrl: './lkb-categories.component.html',
  styleUrls: ['./lkb-categories.component.scss']
})
export class LkbCategoriesComponent implements OnInit {
  @ViewChild('Nya', { static: false }) selektBox: ElementRef;
  showBackButton = false;
  headline: string;
  categoryName: string;
  categories: LkbCategory[];
  newLoading: boolean = false;
  selektLoading: boolean = false;
  allLoading: boolean = false;

  public get router(): Router {
    return this._router;
  }
  public set router(value: Router) {
    this._router = value;
  }

  constructor(
    private lkbService: LkbService,
    private _router: Router,
    public configService: ConfigService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.headline = 'Leveransklara bilar';
    this.categories = this.lkbService.getCategoryTypes();
    this.newLoading = false;
    this.selektLoading = false;
    this.allLoading = false;
  }

  setWaitToCorrectCategory(category: LkbCategory) {
    switch (category.name) {
      case ("Selekt"):
        this.selektLoading = true;
        break;
      case ("Nya"):
        this.newLoading = true;
        break;
      case ("Alla"):
        this.allLoading = true;
        break;
    }
  }
}
