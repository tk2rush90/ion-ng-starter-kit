import {
  AfterContentInit,
  Component,
  ContentChild,
  DestroyRef,
  HostListener,
  Input,
} from '@angular/core';
import { RadioGroupService } from '../../../../services/app/radio-group/radio-group.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RadioButtonComponent } from './radio-button/radio-button.component';

/** A component which can be used as an option for `RadioGroupComponent` */
@Component({
  selector: 'app-radio',
  imports: [],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  host: {
    class: 'cursor-pointer select-none',
  },
})
export class RadioComponent implements AfterContentInit {
  /** Value of radio to apply when selected */
  @Input({ required: true }) value: any;

  /** Radio button that contains selected indicator */
  @ContentChild(RadioButtonComponent, { descendants: true })
  button?: RadioButtonComponent;

  /** Selected status */
  selected = false;

  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly radioGroupService: RadioGroupService,
  ) {}

  ngAfterContentInit() {
    this.radioGroupService.value$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.selected = this.value === value;

        if (this.button) {
          this.button.selected = this.selected;
        }
      });
  }

  @HostListener('click')
  onHostClick(): void {
    this.radioGroupService.selectOption.emit(this.value);
  }
}
