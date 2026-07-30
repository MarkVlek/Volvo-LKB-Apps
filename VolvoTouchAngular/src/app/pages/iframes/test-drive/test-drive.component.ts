import { Component, OnInit } from '@angular/core';
import { PageCard } from 'src/app/enums/page-card-enum';
import { IFrameHandler, IframeService } from 'src/app/services/iframe.service';

@Component({
  selector: 'app-shop',
  templateUrl: './test-drive.component.html'
})
export class TestDriveComponent implements OnInit {
  constructor(
    private iframeService: IframeService
  ) { }
  ngOnInit(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.TestDrive, true))
  }
  ngOnDestroy(): void {
    this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.TestDrive, false));
  }
}