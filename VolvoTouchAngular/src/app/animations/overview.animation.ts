import { animate, animateChild, group, query, state, style, transition, trigger } from "@angular/animations";
import { RouterAnimationTime } from "../constants";

export const triggerOverviewBar =
    trigger('overviewBar', [
        state('false', style({ transform: "translateY(445px)" })),
        state('true', style({ transform: "translateY(0px)" })),
        transition("false <=> true", [
            group([
                query("@inOutAnimation", [
                    animateChild(),
                    animate(RouterAnimationTime + 's ease-in')
                ], { optional: true }),
                animate(RouterAnimationTime + 's ease-in')
            ])
        ]),
        transition("true <=> false", [
            group([
                query("@inOutAnimation", [
                    animateChild(),
                    animate(RouterAnimationTime + 's ease-in')
                ], { optional: true }),
                animate(RouterAnimationTime + 's ease-in')
            ])
        ])
    ])