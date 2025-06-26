import { Component, computed, input, numberAttribute } from '@angular/core';
import { VariableColors } from '../../../utils/tailwind.utils';

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
    '[class]': `classes()`,
    class: 'block aspect-square',
  },
})
export class SpinnerComponent {
  theme = input<VariableColors>('blue');

  strokeWidth = input(2.5, {
    transform: numberAttribute,
  });

  classes = computed(() => {
    const theme = this.theme();

    return {
      [`text-${theme}-500`]: true,
    };
  });
}
