import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export function slideInOutBottom({
  name = 'slideInOutBottom',
  slideIn = '.15s ease-out',
  slideOut = '.15s ease-out',
}: {
  name?: string;
  slideIn?: string;
  slideOut?: string;
} = {}): AnimationTriggerMetadata {
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
        slideIn,
        style({
          transform: 'translateY(0)',
        }),
      ),
    ),
    transition('* => void', animate(slideOut)),
  ]);
}
