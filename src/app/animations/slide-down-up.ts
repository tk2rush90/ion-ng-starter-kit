import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export function slideDownUp({
  name = 'slideDownUp',
  slideDown = '.15s',
  slideUp = '.15s',
}: {
  name?: string;
  slideDown?: string;
  slideUp?: string;
} = {}): AnimationTriggerMetadata {
  return trigger(name, [
    state(
      'void',
      style({
        transform: 'translateY(-100%)',
      }),
    ),
    transition(
      'void => *',
      animate(
        slideDown,
        style({
          transform: 'translateY(0)',
        }),
      ),
    ),
    transition('* => void', animate(slideUp)),
  ]);
}
