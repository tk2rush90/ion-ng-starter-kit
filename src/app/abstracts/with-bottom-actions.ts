import { booleanAttribute, Component, input } from '@angular/core';
import { BottomActionsJustify } from '../types/bottom-actions-justify';

@Component({
  template: '',
})
export abstract class WithBottomActions {
  withBottomActionsBorder = input(false, {
    transform: booleanAttribute,
  });

  bottomActionsJustify = input<BottomActionsJustify>('right');
}
