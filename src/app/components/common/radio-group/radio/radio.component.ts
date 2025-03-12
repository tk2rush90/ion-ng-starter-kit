import {
  Component,
  HostListener,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { RadioGroupService } from '../../../../services/app/radio-group/radio-group.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/** A component which can be used as an option for `RadioGroupComponent` */
@Component({
  selector: 'app-radio',
  imports: [],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  host: {
    class: 'cursor-pointer select-none',
  },
  encapsulation: ViewEncapsulation.None,
})
export class RadioComponent {
  /** Value of radio to apply when selected */
  @Input({ required: true }) value: any;

  /** Selected status */
  selected = false;

  constructor(private readonly radioGroupService: RadioGroupService) {
    this.radioGroupService.value$
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.selected = this.value === value;

        console.log(value);
      });
  }

  get disabled(): boolean {
    return this.radioGroupService.disabled;
  }

  @HostListener('click')
  onHostClick(): void {
    this.radioGroupService.selectOption.emit(this.value);
  }
}
