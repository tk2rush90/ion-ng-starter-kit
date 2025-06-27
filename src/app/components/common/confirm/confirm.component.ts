import {
  booleanAttribute,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import { AutoFocusDirective } from '../auto-focus/auto-focus.directive';
import { BottomActionsComponent } from '../bottom-actions/bottom-actions.component';
import { VariableColors } from '../../../utils/tailwind.utils';
import { FlatButtonDirective } from '../flat-button/flat-button.directive';
import { FlatButtonMode } from '../../../types/flat-button-mode';
import { WithBottomActions } from '../../../abstracts/with-bottom-actions';

@Component({
  selector: 'app-confirm',
  imports: [
    AutoFocusDirective,
    BottomActionsComponent,
    BottomActionsComponent,
    FlatButtonDirective,
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
  host: {
    class: 'flex flex-col items-stretch',
  },
})
export class ConfirmComponent extends WithBottomActions {
  confirmTheme = input<VariableColors>('blue');

  cancelTheme = input<VariableColors>('red');

  confirmMode = input<FlatButtonMode>('default');

  cancelMode = input<FlatButtonMode>('default');

  overrideCancelLabel = input('');

  overrideConfirmLabel = input('');

  displayCancelButton = input(false, {
    transform: booleanAttribute,
  });

  clickCancel = output<void>();

  clickConfirm = output<void>();

  private readonly overlayRef = inject(OVERLAY_REF);

  close(): void {
    this.overlayRef.close();
  }
}
