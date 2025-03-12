import { Component, HostBinding } from '@angular/core';
import { RadioGroupService } from '../../../../../services/app/radio-group/radio-group.service';
import { fadeInOut } from '../../../../../animations/fade-in-out';

/** A button that displays selected status */
@Component({
  selector: 'app-radio-button',
  imports: [],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
  host: {
    class: 'flex-center w-5 h-5 rounded-full border transition-colors relative',
  },
  animations: [fadeInOut('radioButtonFadeInOut')],
})
export class RadioButtonComponent {
  /** Internal selected status to show and hide selected icon */
  selected = false;

  constructor(private readonly radioGroupService: RadioGroupService) {}

  /** Get classes for host element by `focused` status */
  @HostBinding('class')
  get hostClasses(): object {
    if (this.disabled) {
      return {
        'bg-zinc-50': true,
        'border-zinc-300': true,
      };
    } else if (this.selected && this.focused) {
      // When selected and focused.
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
        'bg-primary-600': true,
      };
    } else {
      return {
        'bg-zinc-400': true,
      };
    }
  }

  /** Get radio group focused status */
  get focused(): boolean {
    return this.radioGroupService.focused;
  }

  /** Get radio group disabled status */
  get disabled(): boolean {
    return this.radioGroupService.disabled;
  }
}
