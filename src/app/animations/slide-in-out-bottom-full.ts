import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const slideInOutBottomFull = ({
  name = 'slideInOutBottomFull',
  slideIn = '.15s ease-out',
  slideOut = '.15s ease-out',
}: { name?: string; slideIn?: string; slideOut?: string } = {}) => {
  return trigger(name, [
    state(
      'void',
      style({
        transform: 'translateY(100%)',
      }),
    ),
    transition(
      'void => *',
      animate(
        slideIn,
        style({
          transform: 'translateY(0)',
        }),
      ),
    ),
    transition('* => void', animate(slideOut)),
  ]);
};
