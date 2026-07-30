import { Component, OnInit } from '@angular/core';
import { PageCard } from 'src/app/enums/page-card-enum';
import { IFrameHandler, IframeService } from 'src/app/services/iframe.service';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html'
})
export class OffersComponent implements OnInit {
  constructor(
    private iframeService: IframeService,
  ) { }
  ngOnInit(): void {
    setTimeout(() => {
      this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.Offers, true))
    }, 20)
  }
  ngOnDestroy(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.Offers, false));
  }
}