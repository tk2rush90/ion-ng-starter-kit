import { Component } from '@angular/core';

/** Toast message component */
@Component({
  selector: 'app-toast-message',
  imports: [],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss',
  host: {
    class:
      'py-2 px-4 rounded-2xl bg-black/80 text-white text-sm w-[calc(100dvh-32px)] max-w-[300px] break-all pointer-events-auto absolute cursor-pointer select-none',
  },
})
export class ToastMessageComponent {}
