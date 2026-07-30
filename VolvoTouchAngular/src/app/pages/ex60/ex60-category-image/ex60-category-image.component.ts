import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { darkenOverTime } from 'src/app/animations/darken-over-time.animation';
import { PageCard } from 'src/app/enums/page-card-enum';
import { Ex60Category, Ex60Service } from 'src/app/services/ex60.service';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ex60-category-image',
  templateUrl: './ex60-category-image.component.html',
  styleUrls: ['./ex60-category-image.component.scss'],
  animations: [darkenOverTime]
})
export class Ex60CategoryImageComponent implements OnInit, OnDestroy {
  @Input() category: Ex60Category;
  onWait: boolean = false;
  disabled: boolean = false;
  private languageSubscription: Subscription;

  constructor(
    private ex60Service: Ex60Service,
    private router: Router,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef) {
    
    ex60Service.currentSelected$.subscribe(value => {
      if (value == this.category) {
        this.onWait = true;
        this.disabled = false;
      } else {
        this.disabled = true;
        this.onWait = false;
      }
    });
  }

  ngOnInit(): void {
    this.onWait = false;
    this.disabled = false;
    
    this.languageSubscription = this.languageService.activeLanguage$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  selectCategory() {
    this.ex60Service.currentSelected$.next(this.category);
    this.ex60Service.setStartCategory(this.category);
    
    switch (this.category.id) {
      case 'leasing':
        this.router.navigate([PageCard.EX60_Leasing]);
        break;
      case 'funktioner':
        this.router.navigate([PageCard.LaunchIframe]);
        break;
      case 'elektrifiering':
        this.router.navigate([PageCard.ElectrificationIframe])
        break;
      case 'app':
        this.router.navigate([PageCard.EX60_App])
        break;
      default:
        console.log('No route defined for category ID:', this.category.id);
        break;
    }
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
        this.languageSubscription.unsubscribe();
    }
    if (this.router.url.includes(PageCard.LaunchIframe)) {
      const country = this.languageService.getActiveCountry();
      var iframe = document.getElementById('launchIframe') as HTMLIFrameElement;

    }
  }
}