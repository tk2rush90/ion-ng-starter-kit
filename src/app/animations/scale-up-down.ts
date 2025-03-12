import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Create animation trigger for scaleUpDown.
 * @param name - Trigger name to use.
 * @return Animation trigger for scaleUpDown.
 */
export function scaleUpDown(name: string): AnimationTriggerMetadata {
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
        '.1s cubic-bezier(0.58, 0.27, 0.38, 1.48)',
        style({
          transform: 'scale(1)',
        }),
      ),
    ),
    transition('* => void', animate('.15s')),
  ]);
}
