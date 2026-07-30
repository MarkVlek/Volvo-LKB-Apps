import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageCard } from 'src/app/enums/page-card-enum';
import { IFrameHandler, IframeService } from 'src/app/services/iframe.service';

@Component({
  selector: 'app-bdv',
  templateUrl: './bdv.component.html',
})
export class BdvComponent implements OnInit, OnDestroy {

  constructor(private iframeService: IframeService) { }

  ngOnInit(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.Bygg_din_Volvo, true));
  }

  ngOnDestroy(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.Bygg_din_Volvo, false));
  }
}