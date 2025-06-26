import { Component, computed, input } from '@angular/core';
import { SheetActionsAlign } from '../../../types/sheet-actions-align';

@Component({
  selector: 'app-overlay-actions',
  imports: [],
  templateUrl: './overlay-actions.component.html',
  styleUrl: './overlay-actions.component.scss',
  host: {
    '[class]': `classes()`,
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
