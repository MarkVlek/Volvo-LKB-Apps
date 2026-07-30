import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { LkbService } from 'src/app/services/lkb.service';

@Component({
  selector: 'app-change-interest-modal',
  templateUrl: './change-interest-modal.component.html',
  styleUrls: ['./change-interest-modal.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('5ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('5ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ChangeInterestModalComponent implements OnInit {
  currentInterest: number = 5;
  newInterest: number = 5
  showInterest = true;

  constructor(private lkbService: LkbService) { }

  ngOnInit(): void {
    this.lkbService.getInterestRate().subscribe(value => {
      if (value) {
        this.currentInterest = value[0].InterestRate;
        this.newInterest = this.currentInterest;
      }
    })
  }

  // Function to update the currentInterest value and toggle the showInterest variable
  updateInterest(value: number) {
    this.showInterest = false;
    setTimeout(() => {
      this.newInterest = value;
      this.showInterest = true;
    }, 0);
  }

  valueChange(value: number) {
    this.updateInterest(value);
  }

  save() {
    this.currentInterest = this.newInterest;
    this.lkbService.upsertInterestRate(this.newInterest)
  }
}
