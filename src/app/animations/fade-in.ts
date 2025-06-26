import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export function fadeIn({
  name = 'fadeIn',
  fadeIn = '.15s',
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
  ]);
}
