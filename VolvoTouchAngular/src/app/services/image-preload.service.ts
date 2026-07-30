import { Injectable } from '@angular/core';
import { RTCService } from './rtc.service';

@Injectable({
    providedIn: 'root',
})
export class ImagePreloadService {
    private cache: Map<string, HTMLImageElement> = new Map();


    preloadImage(alias: string, src: string): void {
        if (!this.cache.has(alias)) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                this.cache.set(alias, img);
            };
            img.onerror = () => {
                console.error('Error loading image:', src);
            };
        }
    }

    getImage(alias: string): HTMLImageElement | undefined {
        return this.cache.get(alias);
    }
}
