import { animate, state, style, transition, trigger } from "@angular/animations";

export const accordionPanel = [
    trigger('accordion', [
        state('false', style({
            transform: 'translateY(-100%)',
            opacity: '0',
            maxHeight: '0',
            overflow: 'hidden'
        })),
        state('true', style({
            transform: 'translateY(0)',
            opacity: '1',
            height: '*',
            overflow: 'hidden'
        })),
        transition('true <=> false', [
            animate('300ms')
        ])

    ])
]
