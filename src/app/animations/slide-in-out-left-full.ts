import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AnimationOptions } from '../data/animation-options';

export const slideInOutLeftFull = ({
  name = 'slideInOutLeftFull',
  timing = '.15s ease-out',
}: Partial<AnimationOptions> = {}) => {
  return trigger(name, [
    state(
      'void',
      style({
        transform: 'translateX(-100%)',
      }),
    ),
    transition(
      'void => *',
      animate(
        timing,
        style({
          transform: 'translateX(0)',
        }),
      ),
    ),
    transition('* => void', animate(timing)),
  ]);
};
