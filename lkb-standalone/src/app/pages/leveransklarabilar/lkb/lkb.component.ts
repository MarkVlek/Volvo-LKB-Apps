import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VolvoLeveransklarabilar } from '../models/LkbCategory';
import { LkbService } from '../../../services/lkb.service';

@Component({
  selector: 'app-lkb',
  templateUrl: './lkb.component.html',
  styleUrls: ['./lkb.component.scss']
})

export class LkbComponent implements OnInit {
  onCars: boolean = true;
  cars: VolvoLeveransklarabilar[] = [];
  preChosenCategory: string = '';

  constructor(private activatedRoute: ActivatedRoute, public lkbService: LkbService) { }

  ngOnInit(): void {
    // An unconfigured screen legitimately has no inventory, so once the load has finished an empty
    // list means "nothing to show" rather than "still coming".
    this.lkbService.inventoryLoaded$.subscribe(loaded => {
      this.onCars = !loaded || this.lkbService.unfilteredCars.length > 0;
    });
  }
}
