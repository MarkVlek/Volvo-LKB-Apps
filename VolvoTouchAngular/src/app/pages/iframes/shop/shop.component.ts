import { Component, OnInit } from '@angular/core';
import { PageCard } from 'src/app/enums/page-card-enum';
import { IFrameHandler, IframeService } from 'src/app/services/iframe.service';
import { NavigationService } from 'src/app/services/navigation.service';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html'
})
export class ShopComponent implements OnInit {
  constructor(
    private iframeService: IframeService,
    private navigationService: NavigationService
  ) { }
  ngOnInit(): void {
    setTimeout(() => {
      this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.Shop, true))
    }, 20)
  }
  ngOnDestroy(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.Shop, false));
  }
}