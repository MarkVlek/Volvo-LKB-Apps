import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageCard } from 'src/app/enums/page-card-enum';
import { IFrameHandler, IframeService } from 'src/app/services/iframe.service';

@Component({
    selector: 'app-care-by-volvo',
    templateUrl: './care-by-volvo.component.html',
})
export class CareByVolvoComponent implements OnInit, OnDestroy {

    constructor(private iframeService: IframeService) { }

    ngOnInit(): void {
        this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.Care_by_Volvo, true));
    }

    ngOnDestroy(): void {
        this.iframeService.currentIFrame$.next(new IFrameHandler(PageCard.Care_by_Volvo, false));
    }
}

