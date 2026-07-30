import { Component, OnInit } from '@angular/core';
import { PageCard } from 'src/app/enums/page-card-enum';
import { ConfigService } from 'src/app/services/config.service';
import { NavigationService } from 'src/app/services/navigation.service';


@Component({
  selector: 'app-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.scss']
})
export class PageSelectorComponent implements OnInit {

  pageList: PageCard[];
  isShow: boolean = false;

  constructor(public configService: ConfigService) { }


  ngOnInit(): void {
    this.pageList = this.configService.pages;
    console.log("Page list: ", this.pageList);
    this.isShow = this.configService.config['VolvoEndlessAisle_Showroom']?.toString() == 'true';
    
  }
   shouldShowInFooter(page: PageCard): boolean {
      // Hide LaunchIframe from footer when showroom is true  
      if (this.isShow && page === PageCard.LaunchIframe) {
        return false;
      }
      return true;
    }

}
