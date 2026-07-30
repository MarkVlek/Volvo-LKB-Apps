import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { StatisticService } from 'src/app/services/Statistics/statistics.service';


@Component({
  selector: 'app-search-wrapper',
  templateUrl: './search-wrapper.component.html',
  styleUrls: ['./search-wrapper.component.scss']
})
export class SearchWrapperComponent implements OnInit, AfterViewInit {
  @Output() showSearch: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectFooterLink: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('input', { static: false }) input: ElementRef;
  form: FormGroup;
  searchValue: string = "";
  searchValue$: Subject<string> = new Subject<string>();
  atTop: boolean = true;
  atBottom: boolean = false;


  constructor(
    private statisticsService: StatisticService) { }

  ngAfterViewInit(): void {
    this.searchValue$.subscribe(value => {
    })
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      regnr: new FormControl('', [Validators.required])
    });
  }

  onKeyClick(value: string) {
    if (value == "back" && this.searchValue != "") {
      this.searchValue = this.searchValue.slice(0, -1);
    }
    else if (value != "back") {
      if (value == "Space") {
        this.searchValue += " ";
      } else {
        this.searchValue += value;
      }
    }
    this.input.nativeElement.value = this.searchValue;
    this.searchValue$.next(this.searchValue);
  }

  onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const threshold = 5;
    this.atTop = el.scrollTop <= threshold;
    this.atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    if (el.scrollTop <= threshold) console.log("At the top")
    if (el.scrollHeight - el.scrollTop - el.clientHeight <= threshold) console.log("At the bottom")
  }
}
