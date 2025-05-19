import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AnimationOptions } from '../data/animation-options';

export function slideInOutBottom({
  name = 'slideInOutBottom',
  timing = '.15s ease-out',
}: Partial<AnimationOptions> = {}): AnimationTriggerMetadata {
  return trigger(name, [
    state(
      'void',
      style({
        transform: 'translateY(10%)',
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
}
