import {
  booleanAttribute,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import { AutoFocusDirective } from '../auto-focus/auto-focus.directive';
import { SheetActionsComponent } from '../sheet-actions/sheet-actions.component';
import { VariableColors } from '../../../utils/tailwind.utils';
import { FlatButtonDirective } from '../flat-button/flat-button.directive';
import { FlatButtonMode } from '../../../types/flat-button-mode';

@Component({
  selector: 'app-confirm',
  imports: [
    AutoFocusDirective,
    SheetActionsComponent,
    SheetActionsComponent,
    FlatButtonDirective,
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
  host: {
    class: 'flex flex-col items-stretch',
  },
})
export class ConfirmComponent {
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
