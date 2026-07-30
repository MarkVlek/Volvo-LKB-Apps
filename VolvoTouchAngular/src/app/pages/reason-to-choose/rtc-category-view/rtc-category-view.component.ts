import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RTCCategory } from '../rtc-models/rtc-category.model';
import { RTCService } from 'src/app/services/rtc.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PageCard } from 'src/app/enums/page-card-enum';
import { Subscription } from 'rxjs';
import { triggerSamePageRouting } from 'src/app/animations/route-to-same-page.animations';
import { CreateMatrixService, Tile } from 'src/app/services/create-matrix.service';
import { ItemClassName } from 'src/app/constants';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-rtc-category-view',
  templateUrl: './rtc-category-view.component.html',
  styleUrls: ['./rtc-category-view.component.scss'],
  animations: [triggerSamePageRouting]
})
export class RTCCatagoryViewComponent implements OnInit, OnDestroy {

  @ViewChild('target') targetElement: ElementRef;
  categories: RTCCategory[];
  currentPage: string;
  maxPerRow = 3;
  gridCols = this.maxPerRow * 2;

  //#region SamePageAnimation
  public pageChange$: Subscription;
  public boolFadeIn = true;
  //#endregion

  public matrix: Tile[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private rtcService: RTCService,
    private navigationService: NavigationService,
    private createMtricService: CreateMatrixService,
    private configService: ConfigService  
  ) {

    this.pageChange$ = this.navigationService.pageChanged$.subscribe(value => {
      let currentNav = decodeURIComponent(value).split('/').filter(e => e);
      if (currentNav[0] == PageCard.RTCCategoryList && currentNav[1] != this.currentPage) {
        this.boolFadeIn = false;
        setTimeout(() => { this.boolFadeIn = true; }, 100);
      };
    });
  }

  ngOnInit(): void {
    
    this.currentPage = this.activatedRoute.snapshot.params["page"];
    this.categories = [];
    this.categories = this.rtcService.getCategoryList(this.currentPage).categories;
    this.matrix = this.createMtricService.CreatMatrix(this.categories);
    ItemClassName.lastItemClicked = ""

  }

  ngOnDestroy(): void {

    this.pageChange$.unsubscribe()

  }

  spanForCols(index: number, length: number): number {
    const n = this.maxPerRow;
    const base = this.gridCols;
    const defaultSpan = base / n;
    const r = length % n;
    if (r === 1 && index === length - 1) return base;
    if (r === 2 && index >= length - 2) return base / 2;
    return defaultSpan;
  }
}
