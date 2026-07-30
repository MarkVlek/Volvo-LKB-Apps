import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() min: number;
  @Input() max: number;
  @Input() start: number;
  @Input() step: number;
  @Output() newSliderChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {}

  onInputChange(event: Event) {
    let value = Number((event.target as HTMLInputElement).value);
    this.newSliderChange.emit(value)
  }
}
