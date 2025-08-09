import { booleanAttribute, Component, inject, input } from '@angular/core';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import { IconButtonDirective } from '../icon-button/icon-button.directive';
import { LucideAngularModule, XIcon } from 'lucide-angular';

/** A modal container */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  host: {
    class:
      'pointer-events-auto fixed left-1/2 top-1/2 flex w-[calc(100dvw-2rem)] flex-col items-stretch overflow-auto rounded-3xl bg-background shadow-2xl',
  },
  imports: [IconButtonDirective, LucideAngularModule],
})
export class ModalComponent {
  modalTitle = input<string>('');

  displayCloseButton = input(false, { transform: booleanAttribute });

  private readonly overlayRef = inject(OVERLAY_REF);

  /** Close modal */
  close(): void {
    this.overlayRef.close();
  }

  protected readonly XIcon = XIcon;
}
