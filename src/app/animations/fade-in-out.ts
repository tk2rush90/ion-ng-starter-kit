import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AnimationOptions } from '../data/animation-options';

export const fadeInOut = ({
  name = 'fadeInOut',
  timing = '.15s',
}: Partial<AnimationOptions> = {}): AnimationTriggerMetadata => {
  return trigger(name, [
    state(
      'void',
      style({
        opacity: 0,
      }),
    ),
    transition(
      'void => *',
      animate(
        timing,
        style({
          opacity: 1,
        }),
      ),
    ),
    transition('* => void', animate(timing)),
  ]);
};
