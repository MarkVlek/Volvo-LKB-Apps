import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { StatisticService } from 'src/app/services/Statistics/statistics.service';
import { PinchgifService } from 'src/app/services/pinchgif.service';
import { ImagePreloadService } from 'src/app/services/image-preload.service';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.scss']
})
export class EnvironmentComponent implements OnInit, AfterViewInit, OnDestroy {
  environment: string | any;
  public show: boolean = false;
  public showGif: boolean = false;

  constructor(
    private statisticsService: StatisticService,
    private pinchgifService: PinchgifService,
    public imagePreloadService: ImagePreloadService) { }


  ngOnInit(): void {
    this.showGif = false;
    setTimeout(() => {
      this.showGif = true;
    }, 400);

    var x = this.imagePreloadService.getImage('Environment-0').src
    console.log(x)
  }

  ngAfterViewInit(): void {
    this.pinchgifService.startTimer()
    this.pinchgifService.onComplete.subscribe(() => this.showGif = false)
  }

  ngOnDestroy(): void {
    if (this.pinchgifService.subscription$) {
      this.pinchgifService.subscription$.unsubscribe();
    }
  }
}
