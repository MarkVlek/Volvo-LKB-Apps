import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
export interface Tile {
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-test-keyboard',
  templateUrl: './test-keyboard.component.html',
  styleUrls: ['./test-keyboard.component.scss']
})
export class TestKeyboardComponent implements OnInit {
  // THE INPUT NEEDS TO FORMATED AS A CSS VALUE "50px", "100px" "100px" ETC
  @Input() rowHeight: string;
  @Input() iconSize: string;
  @Output() onClicked = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void { }

  addAttendee(e: string) {
    this.onClicked.emit(e);
  }


  tiles: Tile[] = [
    { text: '1', cols: 2, rows: 1 },
    { text: '2', cols: 2, rows: 1 },
    { text: '3', cols: 2, rows: 1 },
    { text: '4', cols: 2, rows: 1 },
    { text: '5', cols: 2, rows: 1 },
    { text: '6', cols: 2, rows: 1 },
    { text: '7', cols: 2, rows: 1 },
    { text: '8', cols: 2, rows: 1 },
    { text: '9', cols: 2, rows: 1 },
    { text: '0', cols: 2, rows: 1 },
    { text: 'back', cols: 3, rows: 1 },
    { text: 'Q', cols: 2, rows: 1 },
    { text: 'W', cols: 2, rows: 1 },
    { text: 'E', cols: 2, rows: 1 },
    { text: 'R', cols: 2, rows: 1 },
    { text: 'T', cols: 2, rows: 1 },
    { text: 'Y', cols: 2, rows: 1 },
    { text: 'U', cols: 2, rows: 1 },
    { text: 'I', cols: 2, rows: 1 },
    { text: 'O', cols: 2, rows: 1 },
    { text: 'P', cols: 2, rows: 1 },
    { text: 'Å', cols: 2, rows: 1 },
    { text: '', cols: 1, rows: 1 },
    { text: '', cols: 1, rows: 1 },
    { text: 'A', cols: 2, rows: 1 },
    { text: 'S', cols: 2, rows: 1 },
    { text: 'D', cols: 2, rows: 1 },
    { text: 'F', cols: 2, rows: 1 },
    { text: 'G', cols: 2, rows: 1 },
    { text: 'H', cols: 2, rows: 1 },
    { text: 'J', cols: 2, rows: 1 },
    { text: 'K', cols: 2, rows: 1 },
    { text: 'L', cols: 2, rows: 1 },
    { text: 'Ö', cols: 2, rows: 1 },
    { text: 'Ä', cols: 2, rows: 1 },
    { text: '', cols: 2, rows: 1 },
    { text: 'Z', cols: 2, rows: 1 },
    { text: 'X', cols: 2, rows: 1 },
    { text: 'C', cols: 2, rows: 1 },
    { text: 'V', cols: 2, rows: 1 },
    { text: 'B', cols: 2, rows: 1 },
    { text: 'N', cols: 2, rows: 1 },
    { text: 'M', cols: 2, rows: 1 },
    { text: '-', cols: 2, rows: 1 },
    { text: '', cols: 2, rows: 1 },
    { text: 'Space', cols: 19, rows: 1 },
    { text: '', cols: 5, rows: 1 },
  ];
}
