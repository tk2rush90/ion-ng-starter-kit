import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Create animation trigger that slide in from bottom and out to bottom.
 * @param name - Animation name to use.
 * @return AnimationTriggerMetadata for slideInOutRight.
 */
export function slideInOutBottom(name: string): AnimationTriggerMetadata {
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
        '.15s ease-out',
        style({
          transform: 'translateY(0)',
        }),
      ),
    ),
    transition('* => void', animate('.15s ease-out')),
  ]);
}
