import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Create animation trigger that slide in from right and out to right.
 * @param name - Animation name to use.
 * @return AnimationTriggerMetadata for slideInOutRight.
 */
export function slideInOutRight(name: string): AnimationTriggerMetadata {
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
        '.15s ease-out',
        style({
          transform: 'translateX(0)',
        }),
      ),
    ),
    transition('* => void', animate('.15s ease-out')),
  ]);
}
