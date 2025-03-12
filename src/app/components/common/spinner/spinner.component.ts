import { Component } from '@angular/core';

/**
 * A simple loading spinner.
 * Width, height, and color should be set when using.
 * Color of spinner can be changed by setting text color to this component.
 */
@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  host: {
    class:
      'inline-block rounded-full relative before:border before:border-[2px] before:absolute before:rounded-full before:border-box',
  },
})
export class SpinnerComponent {}
