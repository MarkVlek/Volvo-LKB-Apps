import { animate, state, style, transition, trigger } from "@angular/animations";

export const changeColor = trigger('colorChange', [
    state('1', style({ color: 'black' })),
    state('2', style({ color: 'rgb(177, 177, 177)' })),
    transition('* <=> *', [
        animate('0.5s')
    ])
])

export const changeBackgroundColor = trigger('backgroundColorChange', [
    state('1', style({ backgroundColor: 'black' })),
    state('2', style({ backgroundColor: 'gray' })),
    transition('* <=> *', [
        animate('0.5s')
    ])
])
