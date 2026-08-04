import { trigger, transition, style, query, animateChild, group, animate, animation, useAnimation } from '@angular/animations';
// import { RouterAnimationTime } from '../constants';
import { RouterAnimationEnum } from '../enums/router-animation.enum';
const enterAnimation = animation([
    style({ position: 'absolute', top: 0, right: 0, left: 0, width: '100%', transform: 'translate3d(0, 3%, 0)', opacity: 0.8, zIndex: 2 }),
    animate('{{time}}s ease-in', style({ transform: 'translate3d(0, 0, 0)', opacity: 1 })),
]);

const leaveAnimation = animation([
    style({ opacity: 0.2 }),
    animate('{{time}}s ease-out', style({ opacity: 0 })),
]);
export const routeTransitionAnimations = trigger('routerTrigger', [
    //#region FORWARDS
    transition(
        `${RouterAnimationEnum.LeveransklaraBilarMain} => ${RouterAnimationEnum.LeveransklaraBilarFilterSerach},
        ${RouterAnimationEnum.LeveransklaraBilarFilterSerach} => ${RouterAnimationEnum.LeveransklaraBilarDetails}`,
        [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    width: '100%',
                }),
            ]),
            query(':enter', [style({ transform: 'translateX(1920px)' })], { optional: true }),
            query(':leave', [style({ transform: 'translateX(0px)' })], { optional: true }),
            query(':leave', animateChild()),
            group([
                query(':enter', [animate('0.2s', style({ transform: ' translateX(0px)' }))], { optional: true }),
                query(':leave', [animate('0.2s', style({ transform: ' translateX(-1920px)' }))], { optional: true }),
            ]),
            query(':enter', animateChild()),
        ],
    ),
    //#endregion
    //#region BACKWARDS
    transition(
        `${RouterAnimationEnum.LeveransklaraBilarFilterSerach} => ${RouterAnimationEnum.LeveransklaraBilarMain},
         ${RouterAnimationEnum.LeveransklaraBilarDetails} => ${RouterAnimationEnum.LeveransklaraBilarFilterSerach}`,
        [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [style({ transform: 'translateX(-1920px)' })]),
            query(':leave', [style({ transform: 'translateX(0px)' })]),
            query(':leave', animateChild()),
            group([
                query(':enter', [animate('0.2s', style({ transform: ' translateX(0px)' }))]),
                query(':leave ', [animate('0.2s', style({ transform: ' translateX(1920px)' }))]),
            ]),
            query(':enter', animateChild())
        ]),
    //#endregion

    // transition('* <=> *', [
    //     style({ position: 'relative' }),
    //     query(':enter, :leave', [
    //         style({
    //             position: 'absolute',
    //             top: 0,
    //             right: 0,
    //             left: 0,
    //             width: '100%',
    //         }),
    //     ], { optional: true }),
    //     query(':enter', [style({ transform: 'translateY(3%)', opacity: 0.8, zIndex: 2 })], { optional: true }),
    //     query(':leave', [style({ opacity: 0.8 }), animateChild()], { optional: true, }),
    //     group([
    //         query(':enter', [animate(RouterAnimationTime + 's ease-in', style({ transform: 'translateY(0%)', opacity: 1 })),], { optional: true }),
    //         query(':leave', [animate(RouterAnimationTime + 's ease-out', style({ opacity: 0 })),], { optional: true })
    //     ]),
    //     query(':enter', animateChild(), { optional: true }),
    // ])


    transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter', useAnimation(enterAnimation, { params: { time: "0.2" } }), { optional: true }),
        query(':leave', useAnimation(leaveAnimation, { params: { time: "0.2" } }), { optional: true }),
    ]),
]);

