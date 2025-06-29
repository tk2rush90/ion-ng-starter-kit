import { booleanAttribute, Component, computed, input } from '@angular/core';
import { BottomActionsJustify } from '../../../types/bottom-actions-justify';

@Component({
  selector: 'app-bottom-actions',
  imports: [],
  templateUrl: './bottom-actions.component.html',
  styleUrl: './bottom-actions.component.scss',
  host: {
    '[class]': `classes()`,
    class:
      'sticky bottom-0 left-0 z-50 flex items-center border-t bg-background px-4 py-3',
  },
})
export class BottomActionsComponent {
  justify = input.required<BottomActionsJustify>();

  withBorder = input(false, {
    transform: booleanAttribute,
  });

  classes = computed(() => {
    const withBorder = this.withBorder();

    const justify = this.justify();

    const isJustifyRight = justify === 'right';

    const isJustifyBetween = justify === 'between';

    const isJustifyLeft = justify === 'left';

    return {
      'border-transparent': !withBorder,
      'border-foreground/15': withBorder,
      'justify-between': isJustifyBetween,
      'justify-end': isJustifyRight,
      'justify-start': isJustifyLeft,
      'gap-1': isJustifyLeft || isJustifyRight,
    };
  });
}
