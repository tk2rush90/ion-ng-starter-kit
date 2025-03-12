import { Directive } from '@angular/core';
import { Icon } from '../../../abstracts/icon';

/** A directive to create ball shape icon button */
@Directive({
  selector: 'button[appIconButton]',
  standalone: true,
  host: {
    class:
      'flex-center w-8 h-8 rounded-full hover:bg-secondary-50 active:bg-secondary-100 transition-colors',
    type: 'button',
  },
})
export class IconButtonDirective extends Icon {}
