import {
  booleanAttribute,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import { OverlayRef } from '../../../services/app/overlay/overlay.service';
import { AutoFocusDirective } from '../auto-focus/auto-focus.directive';

@Component({
  selector: 'app-confirm',
  imports: [AutoFocusDirective],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
  host: {
    class: 'flex-col-stretch gap-4',
  },
})
export class ConfirmComponent {
  @Input({ required: true }) theme = 'primary';

  @Input() overrideCancelLabel = '';

  @Input() overrideConfirmLabel = '';

  @Input({ transform: booleanAttribute }) displayCancelButton = false;

  @Output() clickCancel = new EventEmitter<void>();

  @Output() clickConfirm = new EventEmitter<void>();

  constructor(@Inject(OVERLAY_REF) private readonly overlayRef: OverlayRef) {}

  close(): void {
    this.overlayRef.close();
  }
}
