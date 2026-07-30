import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
    selector: '[appMaskedOverflow]'
})
export class MaskedOverflowDirective {

    // Declare inputs for dynamic values
    @Input('appMaskedOverflow') maxHeight: string = '500px';
    @Input() minHeight: string = '20px';

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    // Use ngOnInit lifecycle hook to apply styles after Input values are bound
    ngOnInit() {
        const styles = {
            '--scrollbar-width': '8px',
            '--mask-height': '50px',
            'overflow-y': 'auto',
            'max-height': this.maxHeight,
            'min-height': this.minHeight,
            'padding-bottom': 'var(--mask-height)',
            'padding-top': 'var(--mask-height)',
            'padding-right': '20px',
            '--mask-image-content': 'linear-gradient(to bottom, transparent, black var(--mask-height), black calc(100% - var(--mask-height)), transparent)',
            '--mask-size-content': 'calc(100% - var(--scrollbar-width)) 100%',
            '--mask-image-scrollbar': 'linear-gradient(black, black)',
            '--mask-size-scrollbar': 'var(--scrollbar-width) 100%',
            'mask-image': 'var(--mask-image-content), var(--mask-image-scrollbar)',
            'mask-size': 'var(--mask-size-content), var(--mask-size-scrollbar)',
            'mask-position': '0 0, 100% 0',
            'mask-repeat': 'no-repeat, no-repeat'
        };

        for (const [property, value] of Object.entries(styles)) {
            this.renderer.setStyle(this.el.nativeElement, property, value);
        }
    }
}
