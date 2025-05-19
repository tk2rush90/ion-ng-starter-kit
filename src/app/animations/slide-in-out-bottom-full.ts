import { AnimationOptions } from '../data/animation-options';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const slideInOutBottomFull = ({
  name = 'slideInOutBottomFull',
  timing = '.15s ease-out',
}: Partial<AnimationOptions> = {}) => {
  return trigger(name, [
    state(
      'void',
      style({
        transform: 'translateY(100%)',
      }),
    ),
    transition(
      'void => *',
      animate(
        timing,
        style({
          transform: 'translateY(0)',
        }),
      ),
    ),
    transition('* => void', animate(timing)),
  ]);
};
