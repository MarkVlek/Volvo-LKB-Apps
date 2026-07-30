import { Component, OnInit } from '@angular/core';
import { EnergySaverService } from '../services/energy-saver.service';

@Component({
  selector: 'app-energy-saver',
  templateUrl: './energy-saver.component.html',
  styleUrls: ['./energy-saver.component.scss']
})
export class EnergySaverComponent implements OnInit {
  isActive: boolean = false;
  
  constructor(public energySaverService: EnergySaverService) {}
  
  ngOnInit(): void {
    this.energySaverService.isActive$.subscribe(active => {
      this.isActive = active;
    });
  }
}