import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-lkb-slider',
  templateUrl: './lkb-slider.component.html',
  styleUrls: ['./lkb-slider.component.scss']
})
export class LkbSliderComponent implements OnInit {
  @Input() widthInput: number;
  @Input() title: string;
  @Input() startValue: number;
  @Input() endValue: number;
  valueChange$: Subject<void> = new Subject<void>();

  @Output() ValueOut = new EventEmitter<MinMaxOutput>();

  currentMin: number;
  currentMax: number;

  showOnlyOneValue: boolean;

  style: string;

  constructor() { }

  ngOnInit(): void {
    this.valueChange$.subscribe(() => {
      if(this.currentMin == this.currentMax){
        this.showOnlyOneValue = true;
      }
      else{
        this.showOnlyOneValue = false;
      }
      this.ValueOut.emit(new MinMaxOutput(this.currentMin, this.currentMax))
    });


    this.showOnlyOneValue = false;
    this.style = "width: " + this.widthInput + "px";
    this.currentMin = this.startValue;
    this.currentMax = this.endValue;
  }

  minValueChange(value:number) {
    this.currentMin = value;
    this.valueChange$.next();
  }

  maxValueChange(value:number) {
    this.currentMax = value;
    this.valueChange$.next();
  }
}

export class MinMaxOutput {
  min: number;
  max: number;

  constructor(min: number, max: number) {
    this.min =min;
    this.max = max;
  }
}