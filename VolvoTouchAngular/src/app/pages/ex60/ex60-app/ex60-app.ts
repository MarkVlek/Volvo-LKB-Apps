import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-ex60-app',
  templateUrl: './ex60-app.html',
  styleUrls: ['./ex60-app.scss'],
})
export class Ex60App {
@ViewChild('leasingContainer', { static: false }) container: ElementRef;
  
  constructor(private navigationService: NavigationService) { }

  ngOnInit() {
    this.navigationService.showBackButton = true;
  }

  ngOnDestroy() {
    this.navigationService.showBackButton = false;
  }
}
