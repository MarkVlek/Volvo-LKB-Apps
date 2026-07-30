import { Component, EventEmitter, Input, Output } from '@angular/core';
export interface Tile { text: string; cols: number; rows: number; }

@Component({
  selector: 'app-number-pad',
  templateUrl: './number-pad.component.html',
  styleUrls: ['./number-pad.component.scss']
})
export class NumberPadComponent {
  @Input() rowHeight: string;
  @Input() iconSize: string;
  @Output() onClicked = new EventEmitter<string>();


  addAttendee(event: string) {
    this.onClicked.emit(event);
  }


  tiles: Tile[] = [
    { text: '1', cols: 1, rows: 1 },
    { text: '2', cols: 1, rows: 1 },
    { text: '3', cols: 1, rows: 1 },
    { text: '4', cols: 1, rows: 1 },
    { text: '5', cols: 1, rows: 1 },
    { text: '6', cols: 1, rows: 1 },
    { text: '7', cols: 1, rows: 1 },
    { text: '8', cols: 1, rows: 1 },
    { text: '9', cols: 1, rows: 1 },
    { text: '', cols: 1, rows: 1 },
    { text: '0', cols: 1, rows: 1 },
    { text: 'back', cols: 1, rows: 1 },
  ]
}
