import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export function fadeInOut({
  name = 'fadeInOut',
  fadeIn = '.15s',
  fadeOut = '.15s',
}: {
  name?: string;
  fadeIn?: string;
  fadeOut?: string;
} = {}): AnimationTriggerMetadata {
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
        fadeIn,
        style({
          opacity: 1,
        }),
      ),
    ),
    transition('* => void', animate(fadeOut)),
  ]);
}
