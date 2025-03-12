import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Create animation trigger for expandCollapse.
 * @param name - Trigger name to use.
 * @return Animation trigger for expandCollapse.
 */
export function expandCollapse(name: string): AnimationTriggerMetadata {
  return trigger(name, [
    state(
      'void',
      style({
        height: 0,
      }),
    ),
    transition(
      'void => *',
      animate(
        '.15s',
        style({
          height: '*',
        }),
      ),
    ),
    transition('* => void', animate('.15s')),
  ]);
}
