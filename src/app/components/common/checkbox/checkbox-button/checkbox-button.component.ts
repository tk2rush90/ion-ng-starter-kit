import { Component, HostBinding } from '@angular/core';
import { CheckboxService } from '../../../../services/app/checkbox/checkbox.service';
import { IconCheckComponent } from '../../../icons/icon-check/icon-check.component';
import { fadeInOut } from '../../../../animations/fade-in-out';

/** Checkbox button with checked status */
@Component({
  selector: 'app-checkbox-button',
  imports: [IconCheckComponent],
  templateUrl: './checkbox-button.component.html',
  styleUrl: './checkbox-button.component.scss',
  host: {
    class: 'flex-center rounded border w-5 h-5 transition-colors',
  },
  animations: [fadeInOut('checkboxButtonFadeInOut')],
})
export class CheckboxButtonComponent {
  constructor(private readonly checkboxService: CheckboxService) {}

  /** Get host classes by `focused` and `checked` status */
  @HostBinding('class')
  get hostClasses(): object {
    if (this.disabled) {
      return {
        'bg-zinc-50': true,
        'border-zinc-300': true,
      };
    } else if (this.focused || (this.checked && this.focused)) {
      // When focused, or checked and focused.
      return {
        'border-primary-600': true,
        'bg-primary-100': true,
      };
    } else {
      return {
        'border-zinc-300': true,
      };
    }
  }

  /** Get classes for selected indicator by `focused` status */
  get indicatorClasses(): object {
    if (this.focused && !this.disabled) {
      // Focused and not disabled.
      return {
        'text-primary-900': true,
      };
    } else {
      return {
        'text-zinc-900': true,
      };
    }
  }

  /** Get checked status */
  get checked(): boolean {
    return this.checkboxService.checked;
  }

  /** Get focused status */
  get focused(): boolean {
    return this.checkboxService.focused;
  }

  /** Get disabled status */
  get disabled(): boolean {
    return this.checkboxService.disabled;
  }
}
