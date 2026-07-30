import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CONTINUEMODAL_TIME } from 'src/app/constants';
import { PageCard } from 'src/app/enums/page-card-enum';
import { ContinueTimerService } from 'src/app/services/continue-timer.service';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { ScreensaverService } from 'src/app/services/screen-saver.service';
import { StatisticService } from 'src/app/services/Statistics/statistics.service';

@Component({
  selector: 'app-continue-modal',
  templateUrl: './continue-modal.component.html',
  styleUrls: ['./continue-modal.component.scss']
})
export class ContinueModalComponent implements OnInit {
  progressbarValue: number = 0;
  constructor(
    private continueTimerService: ContinueTimerService,
    private router: Router,
    private screensaverTimerService: ScreenSaverTimerService,
    private screenSaverService: ScreensaverService,
    public dialogRef: MatDialogRef<ContinueModalComponent>,
    private statisticService: StatisticService) { }

  ngOnInit(): void {
    this.continueTimerService.startTimer();

    this.continueTimerService.observer$.subscribe(() => {
      this.progressbarValue = this.LerpZeroTOHundred(this.continueTimerService.time);
    });

    this.continueTimerService.onComplete.subscribe(() => {
      this.dialogRef.close(true);
    });
  }


  LerpZeroTOHundred(input: number): number {
    let output = input * 10 / CONTINUEMODAL_TIME;
    return output;
  }

  exit() {
    this.continueTimerService.subscription$.unsubscribe();
    this.dialogRef.close(true);
  }

  continue() {
    this.continueTimerService.subscription$.unsubscribe();
    this.screensaverTimerService.startTimer();
    this.dialogRef.close(false);
  }
}
