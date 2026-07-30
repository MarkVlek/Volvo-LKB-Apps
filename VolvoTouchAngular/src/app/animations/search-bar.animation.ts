import { animate, animateChild, group, query, state, style, transition, trigger } from "@angular/animations";
import { RouterAnimationTime } from "../constants";

export const triggerSearchBar =
    trigger('searchBar', [
        state('false', style({ transform: "translateY(0px)" })),
        state('true', style({ transform: "translateY(-700px)" })),
        transition("false <=> true", [
            group([
                query("@inOutAnimation", [
                    animateChild(),
                    animate(RouterAnimationTime + 's ease-in')
                ]),
                animate(RouterAnimationTime + 's ease-in')
            ])
        ]),
        transition("true <=> false", [
            group([
                query("@inOutAnimation", [
                    animateChild(),
                    animate(RouterAnimationTime + 's ease-in')
                ]),
                animate(RouterAnimationTime + 's ease-in')
            ])
        ])
    ])


    // trigger('searchBar', [
    //     state('false', style({ transform: "translateY(0px)" })),
    //     state('true', style({ transform: "translateY(-700px)" })),
    //     transition('false => true', animate(RouterAnimationTime + 's ease-in')),
    //     transition('true => false', animate(RouterAnimationTime + 's ease-out')),
    // ])