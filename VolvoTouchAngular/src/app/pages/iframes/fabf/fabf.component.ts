import { Component } from '@angular/core';
import { IframeService, IFrameHandler } from 'src/app/services/iframe.service';
import { PageCard } from 'src/app/enums/page-card-enum';

@Component({
  selector: 'app-fabf',
  templateUrl: './fabf.component.html',
})
export class FabfComponent {

  constructor(private iframeService: IframeService) {}

  ngOnInit(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.Fabf, true))
  }

  ngOnDestroy(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.Fabf, false))
  }

}
