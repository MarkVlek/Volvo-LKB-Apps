import { trigger, transition, animate, style } from "@angular/animations";

export const fadeAnimation =
    trigger('inOutAnimation',
        [
            transition(':enter', [style({ opacity: 0 }), animate('0.4s ease-in', style({ opacity: 1 }))]),
            transition(':leave', [style({ opacity: 1 }), animate('0.4s ease-out', style({ opacity: 0 }))])
        ]
    )
