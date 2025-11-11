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
    class: 'overlay-close-detector',
    'animate.enter': 'fade-in',
    'animate.leave': 'fade-out',
  },
})
export class BackdropComponent {}
