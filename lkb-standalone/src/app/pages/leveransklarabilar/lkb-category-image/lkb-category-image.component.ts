import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { darkenOverTime } from '../../../animations/darken-over-time.animation';
import { PageCard } from '../../../enums/page-card-enum';
import { LkbService } from '../../../services/lkb.service';
import { LkbCategory } from '../models/LkbCategory';

@Component({
  selector: 'app-lkb-category-image',
  templateUrl: './lkb-category-image.component.html',
  styleUrls: ['./lkb-category-image.component.scss'],
  animations: [darkenOverTime]
})
export class LkbCategoryImageComponent implements OnInit {
  @Input() category: LkbCategory;
  onWait: boolean = false;
  disabled: boolean = false;
  style: string;

  constructor(
    private lkbService
      : LkbService,
    private router: Router) {
    lkbService
      .currentSelected$.subscribe(value => {
        if (value == this.category) {
          this.onWait = true;
          this.disabled = false;
        }
        else {
          this.disabled = true;
          this.onWait = false;
        }
      });
  }

  ngOnInit(): void {
    this.onWait = false
    this.disabled = false;
  };

  selectCategory() {
    this.lkbService.currentSelected$.next(this.category);
    this.lkbService.setStartCategory(this.category);
    this.router.navigate([PageCard.Leveransklara_bilarcategory]);
    return;
  }
}
