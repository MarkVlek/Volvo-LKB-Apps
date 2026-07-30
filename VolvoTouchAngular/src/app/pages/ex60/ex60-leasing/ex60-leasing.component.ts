import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-ex60-leasing',
  templateUrl: './ex60-leasing.component.html',
  styleUrls: ['./ex60-leasing.component.scss']
})
export class Ex60LeasingComponent implements OnInit, OnDestroy {
  @ViewChild('leasingContainer', { static: false }) container: ElementRef;
  
  // QR code configuration
  qrCodeUrl: string = 'https://www.volvocars.com/se/leasing/ex60'; // Change this URL as needed
  qrCodeSize: number = 120;
  
  constructor(
    private navigationService: NavigationService,
    public configService: ConfigService
  ) { }

  ngOnInit() {
    this.navigationService.showBackButton = true;
    console.log('QR Code URL:', this.qrCodeUrl); // Add this to debug

  }

  ngOnDestroy() {
    this.navigationService.showBackButton = false;
  }
}