import { Component, OnInit } from '@angular/core';
import { PageCard } from 'src/app/enums/page-card-enum';
import { ConfigService } from 'src/app/services/config.service';
import { IframeService } from 'src/app/services/iframe.service';

@Component({
  selector: 'app-dynamic-iframe',
  templateUrl: './dynamic-iframe.component.html',
  styleUrls: ['./dynamic-iframe.component.scss']
})
export class DynamicIframeComponent implements OnInit {
  iframeVisibility: { [key in PageCard]: boolean } = initIframeVisibility();
  public PageCard = PageCard;

  constructor(private iframeService: IframeService, public configService: ConfigService) { }

  ngOnInit(): void {
    this.iframeService.currentIFrame$.subscribe(value => {
      this.setActiveIframe(value.name);
    });
  }

  ngAfterViewInit(): void {
    if (this.configService.config['VolvoEndlessAisle_DefaultChannel']?.toString() == 'TestDrive') {
      this.setActiveIframe(PageCard.TestDrive);
    }
    if (this.configService.config['VolvoEndlessAisle_DefaultChannel']?.toLowerCase().toString() == 'bygg din volvo') {
      this.setActiveIframe(PageCard.Bygg_din_Volvo);
    }
  }

  setActiveIframe(activeIframe: PageCard) {
    for (const key in this.iframeVisibility) {
      this.iframeVisibility[key as PageCard] = key === activeIframe;
    }
  }
}

function initIframeVisibility(): { [key in PageCard]: boolean } {
  const visibility: Partial<{ [key in PageCard]: boolean }> = {};

  for (const key in PageCard) {
    visibility[PageCard[key as keyof typeof PageCard]] = false;
  }

  return visibility as { [key in PageCard]: boolean };
}