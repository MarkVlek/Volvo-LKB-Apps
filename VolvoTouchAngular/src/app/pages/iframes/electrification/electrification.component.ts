import { Component } from '@angular/core';
import { PageCard } from 'src/app/enums/page-card-enum';
import { IFrameHandler, IframeService } from 'src/app/services/iframe.service';

@Component({
  selector: 'app-electrification',
  templateUrl: './electrification.component.html',
})
export class ElectrificationComponent {
  constructor(private iframeService: IframeService) { }

  ngOnInit(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.ElectrificationIframe, true));
  }

  ngOnDestroy(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.ElectrificationIframe, false));
  }
}
