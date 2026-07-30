import { Component } from '@angular/core';
import { PageCard } from 'src/app/enums/page-card-enum';
import { IFrameHandler, IframeService } from 'src/app/services/iframe.service';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
})
export class LaunchComponent {
  constructor(private iframeService: IframeService) { }

  ngOnInit(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.LaunchIframe, true));
  }

  ngOnDestroy(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.LaunchIframe, false));
  }
}