import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { RTCCategory } from '../rtc-models/rtc-category.model';
import { ImagePreloadService } from 'src/app/services/image-preload.service';

@Component({
  selector: 'app-rtc-category',
  templateUrl: './rtc-category.component.html',
  styleUrls: ['./rtc-category.component.scss'],
})
export class RTCCategoryComponent implements OnInit {
  @Input() category: RTCCategory;
  @Input() Index: number;
  image: string;
  from: string;
  imageStyle: string;
  imgsrc: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private imagePreloadService: ImagePreloadService) { }

  ngOnInit(): void {

    let url = this.activatedRoute.snapshot.url.join().split(',')
    this.from = decodeURIComponent(url[1]);
    this.imgsrc = this.imagePreloadService.getImage(this.from.toString() + this.Index.toString()).src
  }

  onClick() {
    if (!!this.category.categories) {
      this.router.navigate([PageCard.RTCCategoryList, this.category.name])
    }
    else {
      this.router.navigate([PageCard.RTCItemList, this.from, this.category.name, ""]);
    }
  }

  getImage(): string {
    if (!!this.category.hero_image) {
      return this.category.hero_image;
    }
    else {
      return this.category.thumbnail;
    };
  }

  isServices(header: string): boolean {

    return header.includes("Privat") || header.includes("Företag");

  }
}

