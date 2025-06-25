import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export function expandCollapse({
  name = 'expandCollapse',
  expand = '.15s',
  collapse = '.15s',
}: {
  name?: string;
  expand?: string;
  collapse?: string;
} = {}): AnimationTriggerMetadata {
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
        expand,
        style({
          height: '*',
        }),
      ),
    ),
    transition('* => void', animate(collapse)),
  ]);
}
