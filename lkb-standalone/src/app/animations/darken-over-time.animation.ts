import { animate, state, style, transition, trigger } from "@angular/animations";

const time: string = "0";

export const darkenOverTime =
    trigger('darkenOverTime', [
        state('false', style({ filter: "blur(0px)" })),
        state('true', style({ filter: "blur(5px) grayscale(100%)" })),
        transition('false => true', animate(time + 's', style({ filter: "blur(0px)" }))),
        transition('true => false', animate(time + 's', style({ filter: "blur(5px) grayscale(100%)" })))
    ])


