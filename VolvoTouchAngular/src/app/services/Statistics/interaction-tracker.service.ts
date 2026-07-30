import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InteractionTrackingService {
  
  private interactionCount = 0;

  constructor(private ngZone: NgZone) {
    this.initializeGlobalListeners();
  }

  private initializeGlobalListeners() {
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('click', this.handleInteraction.bind(this), true);
      //document.addEventListener('touchstart', this.handleInteraction.bind(this), true);
    });
  }

  private handleInteraction(event: Event) {
    this.interactionCount++;
  }

  getInteractionCount(): number {
    return this.interactionCount;
  }

  resetCounter() {
    this.interactionCount = 0;
  }
}