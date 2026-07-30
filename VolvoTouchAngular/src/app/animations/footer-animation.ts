import { animate, state, style, transition, trigger } from "@angular/animations";

export const footerGrow = [
    trigger('growLeft', [
    state('hidden', style({ width: '0px' })),
    state('visible', style({ width: '*' })),
    transition('hidden => visible', animate('240ms cubic-bezier(.2,.8,.2,1)')),
    transition('visible => hidden', animate('160ms ease-in'))
    ])
]