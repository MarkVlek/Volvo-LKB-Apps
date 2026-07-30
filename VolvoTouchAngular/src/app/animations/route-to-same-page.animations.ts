import { animate, state, style, transition, trigger } from "@angular/animations";
import { RouterAnimationTime } from "../constants";

export const triggerSamePageRouting = trigger('fade', [
    state('false', style({ transform: 'translate3d(0, 3%, 0)', opacity: 0 })),
    state('true', style({ transform: 'translate3d(0, 0, 0)', opacity: 1 })),
    transition('false => true', animate(RouterAnimationTime + 's', style({ transform: 'translate3d(0, 0, 0)', opacity: 1 }))),
    transition('true => false', animate(RouterAnimationTime + 's', style({ transform: 'translate3d(0, 3%, 0)', opacity: 0 })))
]);
