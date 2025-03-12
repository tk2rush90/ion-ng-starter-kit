import { Component } from '@angular/core';

/**
 * A transparent backdrop.
 * Color can be set by binding bg class to component.
 */
@Component({
  selector: 'app-backdrop',
  imports: [],
  templateUrl: './backdrop.component.html',
  styleUrl: './backdrop.component.scss',
  host: {
    class:
      'fixed top-0 left-0 right-0 bottom-0 block pointer-events-auto overlay-close-detector',
  },
})
export class BackdropComponent {}
