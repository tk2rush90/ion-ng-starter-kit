import { Component } from '@angular/core';

/** Toast message component */
@Component({
  selector: 'app-toast-message',
  imports: [],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss',
  host: {
    class:
      'pointer-events-auto w-full max-w-xs cursor-pointer select-none break-all rounded-2xl bg-slate-900 p-4 text-white',
  },
})
export class ToastMessageComponent {}
