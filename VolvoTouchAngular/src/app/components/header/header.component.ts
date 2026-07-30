import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LanguageService } from 'src/app/services/language.service';
import { ConfigService } from 'src/app/services/config.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PageCard } from 'src/app/enums/page-card-enum';
import { IframeService } from 'src/app/services/iframe.service';
import { TranslateService } from '@ngx-translate/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isEx60Leasing: boolean = false;

  constructor(
    public languageService: LanguageService,
    private configService: ConfigService,
    public navigationService: NavigationService,
    private iFrameService: IframeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isEx60Leasing =
          event.url === '/EX60Leasing' || event.url.includes('EX60Leasing') ||
          event.url === '/ex60App' || event.url.includes('EX60App');

        if (this.isEx60Leasing) {
          document.body.classList.add('ex60-leasing-page');
        } else {
          document.body.classList.remove('ex60-leasing-page');
        }
      });

    this.isEx60Leasing =
      this.router.url === '/EX60Leasing' ||
      this.router.url.includes('EX60Leasing') ||
      this.router.url === '/EX60App' ||
      this.router.url.includes('EX60App');
    if (this.isEx60Leasing) {
      document.body.classList.add('ex60-leasing-page');
    }
  }
}
