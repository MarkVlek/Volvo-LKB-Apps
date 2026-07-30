import { animate, state, style, transition, trigger } from "@angular/animations";

export const rotateCross =
    trigger('rotateCross', [
        state('false', style({ transform: "rotate(45deg)" })),
        state('true', style({ transform: "rotate(0deg)" })),
        transition('false => true', animate('200ms ease-in')),
        transition('true => false', animate('200ms ease-out'))
    ])