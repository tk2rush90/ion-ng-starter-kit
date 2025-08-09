import { Component, computed, input } from '@angular/core';
import { ToastMessage } from '../../../../services/app/toast/toast.service';
import { NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

/** Toast message component */
@Component({
  selector: 'app-toast-message',
  imports: [NgClass, LucideAngularModule],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss',
  host: {
    '[class]': `classes()`,
    class:
      'fixed flex items-center left-1/2 pointer-events-auto w-[calc(100dvw-2rem)] max-w-100 cursor-pointer select-none break-all rounded-2xl p-4 text-white gap-2',
  },
})
export class ToastMessageComponent {
  toast = input.required<ToastMessage>();

  iconClasses = computed(() => {
    const theme = this.toast().theme;

    return {
      [`text-${theme}-500`]: true,
      [`dark:text-${theme}-100`]: true,
    };
  });

  classes = computed(() => {
    const theme = this.toast().theme;

    return {
      [`bg-${theme}-900`]: true,
    };
  });
}
