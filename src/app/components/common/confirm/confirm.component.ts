import {
  booleanAttribute,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import { AutoFocusDirective } from '../auto-focus/auto-focus.directive';
import { SheetActionsComponent } from '../../app/sheet-actions/sheet-actions.component';

@Component({
  selector: 'app-confirm',
  imports: [AutoFocusDirective, SheetActionsComponent],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmComponent {
  theme = input('primary');

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
