import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { IFrameHandler, IframeService } from 'src/app/services/iframe.service';

@Component({
  selector: 'app-electrification-channel',
  templateUrl: './electrification-channel.component.html',
  styleUrls: ['./electrification-channel.component.scss']
})
export class ElectrificationChannelComponent implements OnInit {

  constructor(private router: Router, private iframeService: IframeService) {

  }
  ngOnInit(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.ElectrificationIframe, true));
  }
}
