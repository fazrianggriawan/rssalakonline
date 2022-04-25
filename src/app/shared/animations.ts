import { style, animate, trigger, transition, state } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
    state('in', style({ opacity: 1 })),
    transition('void => *', [
        style({ opacity: 0 }),
        animate(200)
    ])
]);