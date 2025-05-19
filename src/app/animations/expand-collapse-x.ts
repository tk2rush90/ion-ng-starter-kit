import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AnimationOptions } from '../data/animation-options';

export const expandCollapseX = ({
  name = 'expandCollapseX',
  timing = '.15s',
}: Partial<AnimationOptions> = {}) => {
  return trigger(name, [
    state(
      'void',
      style({
        width: 0,
      }),
    ),
    transition(
      'void => *',
      animate(
        timing,
        style({
          width: '*',
        }),
      ),
    ),
    transition('* => void', animate(timing)),
  ]);
};
