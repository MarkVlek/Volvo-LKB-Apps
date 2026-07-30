import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-test-key',
  templateUrl: './test-key.component.html',
  styleUrls: ['./test-key.component.scss']
})
export class TestKeyComponent implements OnInit {
  @Input() value: string;
  @Input() height: string;
  @Input() iconSize: string;
  @Output() sendClickEvent = new EventEmitter<string>();

  get setHeight(): string {
    if (this.value == "") {
      return "height: " + this.height + "; background-color: transparent;";
    }
    else {
      return "height: " + this.height + ";";
    }
  }

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
  }

  sendClick(value: string) {
    this.sendClickEvent.emit(value);
  }
}
