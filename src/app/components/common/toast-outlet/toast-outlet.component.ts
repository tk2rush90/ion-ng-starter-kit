import { Component } from '@angular/core';
import { ToastMessageComponent } from './toast-message/toast-message.component';
import {
  ToastMessage,
  ToastService,
} from '../../../services/app/toast/toast.service';

/** An outlet container to render toast overlays */
@Component({
  selector: 'app-toast-outlet',
  imports: [ToastMessageComponent],
  templateUrl: './toast-outlet.component.html',
  styleUrl: './toast-outlet.component.scss',
  host: {
    class:
      'fixed z-[10000] top-0 bottom-0 left-0 right-0 pointer-events-none p-4 flex flex-col items-center justify-end',
  },
})
export class ToastOutletComponent {
  constructor(private readonly toastService: ToastService) {}

  get toasts(): ToastMessage[] {
    return this.toastService.toasts;
  }
}
