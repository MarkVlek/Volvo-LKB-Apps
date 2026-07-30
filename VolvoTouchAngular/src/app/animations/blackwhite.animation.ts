import { animate, state, style, transition, trigger } from "@angular/animations";

export const blackwhite = trigger('onBlackWhite', [
    state('1', style({ color: 'black', borderBottomColor: 'black' })),
    state('2', style({ color: 'white', borderBottomColor: 'white' })),
    transition('* <=> *', [
        animate('0.1s')
    ])
])