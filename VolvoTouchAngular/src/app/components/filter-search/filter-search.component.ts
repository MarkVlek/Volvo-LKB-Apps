import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RTCService } from 'src/app/services/rtc.service';

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter-search.component.html',
  styleUrls: ['./filter-search.component.scss']
})
export class FilterSearchComponent implements OnInit, OnChanges {
  @Input() request: string = '';
  title: string = "";

  constructor(public rtcService: RTCService) {
    rtcService;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const latestRequest = changes['request'];
    if (latestRequest) {
      this.title = this.request;
    }
  }

  ngOnInit(): void {
  }
}
