import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VolvoLeveransklarabilar } from '../models/LkbCategory';
import { LkbService } from 'src/app/services/lkb.service';

@Component({
  selector: 'app-lkb',
  templateUrl: './lkb.component.html',
  styleUrls: ['./lkb.component.scss']
})

export class LkbComponent implements OnInit {
  onCars: boolean = true;
  cars: VolvoLeveransklarabilar[];
  preChosenCategory: string;

  constructor(private activatedRoute: ActivatedRoute, public lkbService: LkbService) { }

  ngOnInit(): void {
  }
}
