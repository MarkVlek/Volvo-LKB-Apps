import { animate, state, style, transition, trigger } from "@angular/animations";
import { RouterAnimationTime } from "../constants";

export const deliveryAgendaTabSwitch =
    trigger('tab-switch', [
        state('false', style({ opacity: 0.4 })),
        state('true', style({ opacity: 1 })),
        transition('false => true', animate(RouterAnimationTime + 's', style({ opacity: 1 }))),
        transition('true => false', animate(RouterAnimationTime + 's', style({ opacity: 0.4 })))
    ])

export const deliveryContentTabSwitch =
    trigger('tab-switch', [
        state('false', style({ opacity: 0.4, })),
        state('true', style({ opacity: 1, })),
        transition('true => false', animate(RouterAnimationTime + 's', style({ opacity: 0.4, }))),
        transition('false => true', animate(RouterAnimationTime + 's', style({ opacity: 1, })))
    ])

export const tabPageFadeInOut = trigger('tabPageFadeInOut', [
    transition('void => *', [style({ opacity: '0' }), animate(RouterAnimationTime + 's')]),
    transition('* => void', [animate(RouterAnimationTime + 's', style({ opacity: '0' }))]),
    transition('* => *', [style({ opacity: '0' }), animate(RouterAnimationTime + 's', style({ opacity: '1' }))
    ]),
]);

