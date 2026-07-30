import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.scss']
})
export class BackComponent implements OnInit {
  canGoBack: boolean = true;
  currentPath: string = "";

  constructor(
    public navigationService: NavigationService
    // public iFrameService: IframeService
  ) { }

  ngOnInit(): void {
    this.navigationService.pageChanged$.subscribe(value => {
      let path = decodeURIComponent(value).split('/').filter(e => e);
      this.currentPath = path[0];

      if (this.currentPath == 'Leveransklara Bilar') {
        this.navigationService.showBackButton = false;
        this.canGoBack = false;
      } else {
        this.navigationService.showBackButton = true;
        this.canGoBack = true;
      }
    });
  }

  OnBack() {
    this.navigationService.back();
  }
}

