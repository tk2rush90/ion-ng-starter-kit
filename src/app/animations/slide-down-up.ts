import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Create animation trigger for slideDownUp.
 * @param name - Trigger name to use.
 * @return Animation trigger for slideDownUp.
 */
export function slideDownUp(name: string): AnimationTriggerMetadata {
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
        '.15s',
        style({
          transform: 'translateY(0)',
        }),
      ),
    ),
    transition('* => void', animate('.15s')),
  ]);
}
