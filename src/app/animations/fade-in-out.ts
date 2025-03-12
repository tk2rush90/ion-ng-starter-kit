import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Create animation trigger for fadeInOut.
 * @param name - Trigger name to use.
 * @return Animation trigger for fadeInOut.
 */
export function fadeInOut(name: string): AnimationTriggerMetadata {
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
        '.15s',
        style({
          opacity: 1,
        }),
      ),
    ),
    transition('* => void', animate('.15s')),
  ]);
}
