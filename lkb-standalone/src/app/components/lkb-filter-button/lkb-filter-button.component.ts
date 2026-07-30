import { Component, Input, OnInit } from '@angular/core';
import { LkbService } from '../../services/lkb.service';

@Component({
  selector: 'app-lkb-filter-button',
  templateUrl: './lkb-filter-button.component.html',
  styleUrls: ['./lkb-filter-button.component.scss']
})
export class LkbFilterButtonComponent implements OnInit {
  @Input() text: string;
  onActive: boolean;

  constructor() { }

  ngOnInit(): void {
    if (this.text == "Ok�nd") {
      this.text = "Okänd"
    }
    this.onActive = false;
  }

  onClick() {
    this.onActive = !this.onActive;
  }

  styleObject(): Object {
    if (this.onActive) {
      return { "background-color": "#141414", color: "#F5F3F0" }
    }
    else {
      return { "background-color": "#F5F3F0", color: "#141414" }
    }
  }
}
