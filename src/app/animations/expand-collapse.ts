import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AnimationOptions } from '../data/animation-options';

export function expandCollapse({
  name = 'expandCollapse',
  timing = '.15s',
}: Partial<AnimationOptions> = {}): AnimationTriggerMetadata {
  return trigger(name, [
    state(
      'void',
      style({
        height: 0,
      }),
    ),
    transition(
      'void => *',
      animate(
        timing,
        style({
          height: '*',
        }),
      ),
    ),
    transition('* => void', animate(timing)),
  ]);
}
