import { booleanAttribute, Component, Inject, Input } from '@angular/core';
import { OverlayRef } from '../../../services/app/overlay/overlay.service';
import { IconButtonDirective } from '../icon-button/icon-button.directive';
import { IconXMarkComponent } from '../../icons/icon-x-mark/icon-x-mark.component';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';

/** A modal container */
@Component({
  selector: 'app-modal',
  imports: [IconButtonDirective, IconXMarkComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  host: {
    class:
      'fixed bg-white rounded-2xl p-6 flex-col-stretch gap-5 shadow-lg top-1/2 left-1/2 pointer-events-auto max-h-[calc(100dvh-32px)] overflow-auto w-[calc(100dvw-32px)]',
    // To bind `transform` animation or TailwindCSS classes, use `translate` attribute.
    '[style.translate]': `'-50% -50%'`,
  },
})
export class ModalComponent {
  /** Set modal title */
  @Input() modalTitle = '';

  /** Set to display close button */
  @Input({ transform: booleanAttribute }) displayClose = false;

  constructor(@Inject(OVERLAY_REF) private readonly overlayRef: OverlayRef) {}

  /** Close modal */
  close(): void {
    this.overlayRef.close();
  }
}
