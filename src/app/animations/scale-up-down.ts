import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export function scaleUpDown({
  name = 'scaleUpDown',
  scaleUp = '.1s cubic-bezier(0.58, 0.27, 0.38, 1.48)',
  scaleDown = '.15s',
}: {
  name?: string;
  scaleUp?: string;
  scaleDown?: string;
} = {}): AnimationTriggerMetadata {
  return trigger(name, [
    state(
      'void',
      style({
        transform: 'scale(0.9)',
      }),
    ),
    transition(
      'void => *',
      animate(
        scaleUp,
        style({
          transform: 'scale(1)',
        }),
      ),
    ),
    transition('* => void', animate(scaleDown)),
  ]);
}
