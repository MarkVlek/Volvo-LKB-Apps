import { Component } from '@angular/core';
import { PageCard } from 'src/app/enums/page-card-enum';
import { IFrameHandler, IframeService } from 'src/app/services/iframe.service';

@Component({
  selector: 'app-ondemand',
  templateUrl: './ondemand.component.html',
})
export class OndemandComponent {
  constructor(private iframeService: IframeService){ }

  ngOnInit(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.OnDemand, true))
  }

  ngOnDestroy(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.OnDemand, false))
  }
}
