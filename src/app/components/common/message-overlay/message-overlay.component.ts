import { Component, computed, inject, input } from '@angular/core';
import { LucideAngularModule, XIcon } from 'lucide-angular';
import { VariableColors } from '../../../utils/tailwind.utils';
import { NgClass } from '@angular/common';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import { IconButtonDirective } from '../icon-button/icon-button.directive';

@Component({
  selector: 'app-message-overlay',
  imports: [LucideAngularModule, NgClass, IconButtonDirective],
  templateUrl: './message-overlay.component.html',
  styleUrl: './message-overlay.component.scss',
  host: {
    '[style]': `styles`,
    class:
      'pointer-events-auto rounded-3xl fixed left-1/2 bottom-4 pr-2 pl-4 py-4 bg-white dark:bg-dark-background flex items-center gap-4 shadow-2xl max-w-110 w-full border border-solid border-black/15 dark:border-white/15',
  },
})
export class MessageOverlayComponent {
  theme = input<VariableColors>('blue');

  styles = {
    translate: '-50% 0',
  };

  titleClasses = computed(() => {
    const theme = this.theme();

    return {
      [`text-${theme}-500`]: true,
    };
  });

  iconClasses = computed(() => {
    const theme = this.theme();

    return {
      [`bg-${theme}-100`]: true,
      [`text-${theme}-500`]: true,
      [`dark:bg-${theme}-900`]: true,
    };
  });

  private readonly overlayRef = inject(OVERLAY_REF, {
    optional: true,
  });

  close(): void {
    this.overlayRef?.close();
  }

  protected readonly XIcon = XIcon;
}
