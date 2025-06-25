import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export function slideInOutRight({
  name = 'slideInOutRight',
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
        transform: 'translateX(10%)',
      }),
    ),
    transition(
      'void => *',
      animate(
        slideIn,
        style({
          transform: 'translateX(0)',
        }),
      ),
    ),
    transition('* => void', animate(slideOut)),
  ]);
}
