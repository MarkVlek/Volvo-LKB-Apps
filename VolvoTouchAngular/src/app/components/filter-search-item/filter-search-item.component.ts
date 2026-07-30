import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { RTCFiltered } from 'src/app/pages/reason-to-choose/rtc-models/rtc-filtered.model';
import { NavigationService } from 'src/app/services/navigation.service';
import { SearchBarService } from 'src/app/services/search-bar.service';

@Component({
  selector: 'app-filter-search-item',
  templateUrl: './filter-search-item.component.html',
  styleUrls: ['./filter-search-item.component.scss']
})
export class FilterSearchItemComponent implements OnInit {
  @Input() item: RTCFiltered;

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private searchBarService: SearchBarService) { }

  ngOnInit(): void {
  }

  navigateToItem() {
    if (!this.item) return;
    this.searchBarService.onSearchBar$.next(false);
    if (this.item.category == "Tjänster") {
      this.router.navigate([PageCard.RTCItemList, decodeURI(this.item.subCategory), decodeURI(this.item.item), decodeURI(this.item.name)])
    }
    else {
      this.router.navigate([PageCard.RTCItemList, decodeURI(this.item.category), decodeURI(this.item.subCategory), decodeURI(this.item.name)])
    }
    this.navigationService.pageCardClicked$.next(this.generatePageCard(this.item.category));
  }

  redirectTo(uri: string) {
    this.router.navigate([uri]);
  }

  generatePageCard(input: string): PageCard {
    switch (input.toLocaleLowerCase()) {
      case "privat": return PageCard.Tjänster
      case "företag": return PageCard.Tjänster
      case "innovationer": return PageCard.Innovationer
      default: return PageCard.Blank;
    }
  }
}
