import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IframeKeyBoardService } from 'src/app/services/Iframe-keyboard.service';

@Component({
  selector: 'app-iframe-keyboard-key',
  templateUrl: './iframe-keyboard-key.component.html',
  styleUrls: ['./iframe-keyboard-key.component.scss']
})
export class IframeKeyboardKeyComponent {
  @Input() value: string;
  @Input() iconSize: string;
  @Output() sendClickEvent = new EventEmitter<string>();
  @Output() keyHoldStart = new EventEmitter<string>();
  @Output() keyHoldEnd = new EventEmitter<string>();

  constructor(public keyboardService: IframeKeyBoardService) { }

  get back(): boolean {
    if (this.value == "back")
      return true;
    else
      return false;
  }

  get setEmpty(): string {
    if (this.value == "") {
      return "box-shadow: none";
    }
    return "background-color: #fff; border-radius: 20px;"
  }

  get style(): string {
    return "transform: scale(" + this.iconSize.toString() + ");";
  }

  ngOnInit(): void {
    window.addEventListener("contextmenu", e => e.preventDefault());
  }

  onMouseDown(value: string) {
    const element = document.getElementById(value);
    element?.classList.add('active');
    this.keyHoldStart.emit(value);
  }

  onMouseUp(value: string) {
    const element = document.getElementById(value);
    element?.classList.remove('active');
    this.keyHoldEnd.emit(value);
  }

  onMouseLeave(value: string) {
    const element = document.getElementById(value);
    element?.classList.remove('active');
  }

  sendClick(value: string) {
    this.sendClickEvent.emit(value);
  }
}
