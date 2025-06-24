import { Component, inject } from '@angular/core';
import { ToastMessageComponent } from './toast-message/toast-message.component';
import {
  ToastMessage,
  ToastService,
} from '../../../services/app/toast/toast.service';
import { fadeInOut } from '../../../animations/fade-in-out';
import { scaleUpDown } from '../../../animations/scale-up-down';

/** An outlet container to render toast overlays */
@Component({
  selector: 'app-toast-outlet',
  imports: [ToastMessageComponent],
  templateUrl: './toast-outlet.component.html',
  styleUrl: './toast-outlet.component.scss',
  animations: [fadeInOut(), scaleUpDown()],
})
export class ToastOutletComponent {
  private readonly toastService = inject(ToastService);

  get toasts(): ToastMessage[] {
    return this.toastService.toasts;
  }
}
