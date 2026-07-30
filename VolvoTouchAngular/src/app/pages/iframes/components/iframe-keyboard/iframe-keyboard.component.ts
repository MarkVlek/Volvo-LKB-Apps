import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tile } from 'src/app/components/test-keyboard/test-keyboard.component';
import { IframeKeyBoardService } from 'src/app/services/Iframe-keyboard.service';

@Component({
  selector: 'app-iframe-keyboard',
  templateUrl: './iframe-keyboard.component.html',
  styleUrls: ['./iframe-keyboard.component.scss']
})
export class IframeKeyboardComponent {
  @Output() onClicked = new EventEmitter<string>();
  capsActive: boolean = false;
  shiftActive: boolean = false;
  private holdInterval: any = null;
  private holdTimeout: any = null;
  private shouldNotHold: string[] = ["Enter", "Close", "Shift", "CapsLock", "Tab"]

  constructor(private keyboardService: IframeKeyBoardService) { }

  ngOnInit(): void {
  }

  startKeyHold(value: string) {
    if (!this.shouldNotHold.includes(value)) this.stopKeyHold(value);

    this.handleClick(value);

    // if (!this.shouldNotHold.includes(value)) {
    //   this.holdTimeout = setTimeout(() => {
    //     this.holdInterval = setInterval(() => {
    //       this.handleClick(value);
    //     }, 250);
    //   }, 500);
    // }
  }

  stopKeyHold(click: string) {
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout);
      this.holdTimeout = null;
    }
    if (this.holdInterval) {
      clearInterval(this.holdInterval);
      this.holdInterval = null;
    }

    switch (click) {
      case ("Enter"):
      case ("Close"):
        setTimeout(() => {
          this.keyboardService.showKeyboard = false;
        }, 150)
        break;
      case ("CapsLock"):
        this.capsActive = !this.capsActive;
        break;
      case ("Shift"):
        this.shiftActive = !this.shiftActive;
        break;
    }
  }

  handleClick(click: string) {
    switch (click) {
      case ("Tab"):
        this.onClicked.emit("  ")
        break;
      case ("CapsLock"):
        break;
      case ("Shift"):
        break;
      case ("Enter"):
        break;
      case ("Close"):
        break;
      case ("Space"):
        this.onClicked.emit(" ");
        break;
      default:
        this.onClicked.emit(click);
        this.shiftActive = false;
        break;
    }
  }

  tiles: Tile[] = [
    { text: '1', cols: 3, rows: 1 },
    { text: '2', cols: 3, rows: 1 },
    { text: '3', cols: 3, rows: 1 },
    { text: '4', cols: 3, rows: 1 },
    { text: '5', cols: 3, rows: 1 },
    { text: '6', cols: 3, rows: 1 },
    { text: '7', cols: 3, rows: 1 },
    { text: '8', cols: 3, rows: 1 },
    { text: '9', cols: 3, rows: 1 },
    { text: '0', cols: 3, rows: 1 },
    { text: '+', cols: 3, rows: 1 },
    { text: '´', cols: 3, rows: 1 },
    { text: '←', cols: 4, rows: 1 },
    { text: 'Close', cols: 3, rows: 1 },
    { text: 'Tab', cols: 4, rows: 1 },
    { text: 'q', cols: 3, rows: 1 },
    { text: 'w', cols: 3, rows: 1 },
    { text: 'e', cols: 3, rows: 1 },
    { text: 'r', cols: 3, rows: 1 },
    { text: 't', cols: 3, rows: 1 },
    { text: 'y', cols: 3, rows: 1 },
    { text: 'u', cols: 3, rows: 1 },
    { text: 'i', cols: 3, rows: 1 },
    { text: 'o', cols: 3, rows: 1 },
    { text: 'p', cols: 3, rows: 1 },
    { text: 'å', cols: 3, rows: 1 },
    { text: '@', cols: 3, rows: 1 },
    { text: "'", cols: 3, rows: 1 },
    { text: 'CapsLock', cols: 5, rows: 1 },
    { text: 'a', cols: 3, rows: 1 },
    { text: 's', cols: 3, rows: 1 },
    { text: 'd', cols: 3, rows: 1 },
    { text: 'f', cols: 3, rows: 1 },
    { text: 'g', cols: 3, rows: 1 },
    { text: 'h', cols: 3, rows: 1 },
    { text: 'j', cols: 3, rows: 1 },
    { text: 'k', cols: 3, rows: 1 },
    { text: 'l', cols: 3, rows: 1 },
    { text: 'ö', cols: 3, rows: 1 },
    { text: 'ä', cols: 3, rows: 1 },
    { text: "Enter", cols: 5, rows: 1 },
    { text: 'Shift', cols: 4, rows: 1 },
    { text: '<', cols: 3, rows: 1 },
    { text: 'z', cols: 3, rows: 1 },
    { text: 'x', cols: 3, rows: 1 },
    { text: 'c', cols: 3, rows: 1 },
    { text: 'v', cols: 3, rows: 1 },
    { text: 'b', cols: 3, rows: 1 },
    { text: 'n', cols: 3, rows: 1 },
    { text: 'm', cols: 3, rows: 1 },
    { text: ',', cols: 3, rows: 1 },
    { text: '.', cols: 3, rows: 1 },
    { text: "-", cols: 3, rows: 1 },
    { text: 'Shift', cols: 6, rows: 1 },
    { text: "Space", cols: 43, rows: 1 },
  ];
  capsTile: Tile[] = [
    { text: '½', cols: 3, rows: 1 },
    { text: '!', cols: 3, rows: 1 },
    { text: '"', cols: 3, rows: 1 },
    { text: '#', cols: 3, rows: 1 },
    { text: '¤', cols: 3, rows: 1 },
    { text: '%', cols: 3, rows: 1 },
    { text: '&', cols: 3, rows: 1 },
    { text: '/', cols: 3, rows: 1 },
    { text: '(', cols: 3, rows: 1 },
    { text: ')', cols: 3, rows: 1 },
    { text: '=', cols: 3, rows: 1 },
    { text: '?', cols: 3, rows: 1 },
    { text: '←', cols: 4, rows: 1 },
    { text: 'Close', cols: 3, rows: 1 },
    { text: 'Tab', cols: 4, rows: 1 },
    { text: 'Q', cols: 3, rows: 1 },
    { text: 'W', cols: 3, rows: 1 },
    { text: 'E', cols: 3, rows: 1 },
    { text: 'R', cols: 3, rows: 1 },
    { text: 'T', cols: 3, rows: 1 },
    { text: 'Y', cols: 3, rows: 1 },
    { text: 'U', cols: 3, rows: 1 },
    { text: 'I', cols: 3, rows: 1 },
    { text: 'O', cols: 3, rows: 1 },
    { text: 'P', cols: 3, rows: 1 },
    { text: 'Å', cols: 3, rows: 1 },
    { text: '@', cols: 3, rows: 1 },
    { text: '*', cols: 3, rows: 1 },
    { text: 'CapsLock', cols: 5, rows: 1 },
    { text: 'A', cols: 3, rows: 1 },
    { text: 'S', cols: 3, rows: 1 },
    { text: 'D', cols: 3, rows: 1 },
    { text: 'F', cols: 3, rows: 1 },
    { text: 'G', cols: 3, rows: 1 },
    { text: 'H', cols: 3, rows: 1 },
    { text: 'J', cols: 3, rows: 1 },
    { text: 'K', cols: 3, rows: 1 },
    { text: 'L', cols: 3, rows: 1 },
    { text: 'Ö', cols: 3, rows: 1 },
    { text: 'Ä', cols: 3, rows: 1 },
    { text: 'Enter', cols: 5, rows: 1 },
    { text: 'Shift', cols: 4, rows: 1 },
    { text: '>', cols: 3, rows: 1 },
    { text: 'Z', cols: 3, rows: 1 },
    { text: 'X', cols: 3, rows: 1 },
    { text: 'C', cols: 3, rows: 1 },
    { text: 'V', cols: 3, rows: 1 },
    { text: 'B', cols: 3, rows: 1 },
    { text: 'N', cols: 3, rows: 1 },
    { text: 'M', cols: 3, rows: 1 },
    { text: ';', cols: 3, rows: 1 },
    { text: ':', cols: 3, rows: 1 },
    { text: "_", cols: 3, rows: 1 },
    { text: 'Shift', cols: 6, rows: 1 },
    { text: "Space", cols: 43, rows: 1 },
  ]
}
