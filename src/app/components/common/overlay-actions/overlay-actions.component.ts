import { Component, computed, input } from '@angular/core';
import { SheetActionsAlign } from '../../../types/sheet-actions-align';

@Component({
  selector: 'app-overlay-actions',
  imports: [],
  templateUrl: './overlay-actions.component.html',
  styleUrl: './overlay-actions.component.scss',
  host: {
    '[class]': `classes()`,
    class:
      'sticky bottom-0 left-0 z-50 flex items-center border-t border-black/15 bg-white px-4 py-3 dark:bg-dark-background dark:border-white/15',
  },
})
export class OverlayActionsComponent {
  justify = input.required<SheetActionsAlign>();

  classes = computed(() => {
    const classes: any = {};

    switch (this.justify()) {
      case 'right': {
        classes['justify-end'] = true;
        classes['gap-1'] = true;
        break;
      }
      case 'between': {
        classes['justify-between'] = true;
        break;
      }
    }

    return classes;
  });
}
