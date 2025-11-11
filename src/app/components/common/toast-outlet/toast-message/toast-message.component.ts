import {
  AfterViewInit,
  Component,
  computed,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { ToastMessage } from '../../../../services/app/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';

/** Toast message component */
@Component({
  selector: 'app-toast-message',
  imports: [LucideAngularModule],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss',
  host: {
    '[class]': `classes()`,
    'animate.enter': 'toast-message-up',
    'animate.leave': 'toast-message-down',
    class:
      'w-[calc(100dvw-2rem)] relative flex flex-col ion-align-items-center pointer-events-none',
  },
})
export class ToastMessageComponent implements AfterViewInit, OnDestroy {
  toast = input.required<ToastMessage>();

  classes = computed(() => {
    const toast = this.toast();

    const classes: any = {};

    toast.classes.split(' ').forEach((klass) => {
      classes[klass] = true;
    });

    return classes;
  });

  isVisible = signal(false);

  ngAfterViewInit() {
    this.isVisible.set(true);
  }

  ngOnDestroy() {
    this.isVisible.set(false);
  }

  close() {
    this.toast().close();
  }
}
