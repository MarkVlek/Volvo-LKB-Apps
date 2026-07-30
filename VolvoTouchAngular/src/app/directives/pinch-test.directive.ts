import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appPinchZoom]'
})
export class PinchZoomDirectiveTest {
    private scale: number = 1;
    private initialDistance: number;
    private initialMidpoint: { x: number; y: number };
    private initialPageOffset: { x: number; y: number };
    private lastScale: number;

    constructor(private elRef: ElementRef) { }

    @HostListener('touchstart', ['$event'])
    onPinchStart(event: TouchEvent): void {
        if (event.touches.length === 2) {
            this.initialDistance = this.getDistance(event.touches);
            this.initialMidpoint = this.getMidpoint(event.touches);
            this.lastScale = this.scale;
            this.initialPageOffset = {
                x: this.elRef.nativeElement.getBoundingClientRect().left + document.documentElement.scrollLeft,
                y: this.elRef.nativeElement.getBoundingClientRect().top + document.documentElement.scrollTop
            };
        }
    }

    @HostListener('touchmove', ['$event'])
    onPinchMove(event: TouchEvent): void {
        if (event.touches.length === 2) {
            const distance = this.getDistance(event.touches);
            const scaleDelta = distance / this.initialDistance;
            const newScale = this.lastScale * scaleDelta;

            // Prevent zooming out beyond the original size
            this.scale = Math.max(1, newScale);

            // Adjust translation based on the scale
            const currentMidpoint = this.getMidpoint(event.touches);
            const translateX = (currentMidpoint.x - this.initialPageOffset.x) * (1 - this.scale);
            const translateY = (currentMidpoint.y - this.initialPageOffset.y) * (1 - this.scale);

            this.applyScaleAndTranslation(this.scale, translateX, translateY);
        }
    }

    @HostListener('touchend', ['$event'])
    onPinchEnd(event: TouchEvent): void {
        // Optionally, reset the scale and position after the pinch ends
        if (this.scale < 1) {
            this.scale = 1;
        }
        // Apply the scale and reset translation
        this.applyScaleAndTranslation(this.scale, 0, 0);
        this.lastScale = this.scale;
    }

    private applyScaleAndTranslation(scale: number, translateX: number, translateY: number): void {
        const transformString = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        this.elRef.nativeElement.style.transform = transformString;
    }

    private getDistance(touches: TouchList): number {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    private getMidpoint(touches: TouchList): { x: number; y: number } {
        return {
            x: (touches[0].clientX + touches[1].clientX) / 2,
            y: (touches[0].clientY + touches[1].clientY) / 2
        };
    }
}
