import { Component, computed, input } from '@angular/core';
import { SheetActionsAlign } from '../../../types/sheet-actions-align';

@Component({
  selector: 'app-sheet-actions',
  imports: [],
  templateUrl: './sheet-actions.component.html',
  styleUrl: './sheet-actions.component.scss',
  host: {
    '[class]': `classes()`,
  },
})
export class SheetActionsComponent {
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
