import {
  booleanAttribute,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { RadioGroupService } from '../../../services/app/radio-group/radio-group.service';
import { AppControlValueAccessor } from '../../../abstracts/app-control-value-accessor';
import { RadioComponent } from './radio/radio.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { findIndexFromQueryList } from '../../../utils/query-list.utils';

/** Radio group allows selecting an option between multiple options */
@Component({
  selector: 'app-radio-group',
  imports: [],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss',
  host: {
    tabindex: '0',
  },
  providers: [RadioGroupService],
})
export class RadioGroupComponent extends AppControlValueAccessor {
  /** Emits when value has changed */
  @Output() valueChange = new EventEmitter<any>();

  /** Children of `RadioComponent` */
  @ContentChildren(RadioComponent, { descendants: true })
  radioList?: QueryList<RadioComponent>;

  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly radioGroupService: RadioGroupService,
  ) {
    super();

    this.subscribeSelectOption();
  }

  /** Get selected value */
  get value(): any {
    return this.radioGroupService.value;
  }

  /** Set selected value */
  @Input()
  set value(value: any) {
    this.radioGroupService.value = value;
  }

  /** Get disabled status */
  get disabled(): boolean {
    return this.isDisabled;
  }

  /** Set disabled status */
  @Input({ transform: booleanAttribute })
  set disabled(value: boolean) {
    this.setDisabledState(value);
  }

  /** When blurred, mark as touched */
  @HostListener('blur')
  onHostBlur(): void {
    this.onTouched();
    this.radioGroupService.focused = false;
  }

  /** When focused, update status in service */
  @HostListener('focus')
  onHostFocus(): void {
    this.radioGroupService.focused = true;
  }

  /** Listen arrowUp keydown for accessibility */
  @HostListener('keydown.arrowUp', ['$event'])
  onHostArrowUpKeydown(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.toPreviousOption();
  }

  /** Listen arrowDown keydown for accessibility */
  @HostListener('keydown.arrowDown', ['$event'])
  onHostArrowDownKeydown(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.toNextOption();
  }

  /** Listen arrowLeft keydown for accessibility */
  @HostListener('keydown.arrowLeft', ['$event'])
  onHostArrowLeftKeydown(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.toPreviousOption();
  }

  /** Listen arrowRight keydown for accessibility */
  @HostListener('keydown.arrowRight', ['$event'])
  onHostArrowRightKeydown(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.toNextOption();
  }

  /** Update `NgControl` and component values. Also, emits `valueChange` */
  override updateValue(value: any) {
    super.updateValue(value);
    this.valueChange.emit(value);
  }

  /** Write value to component */
  override writeValue(obj: any) {
    this.value = obj;
  }

  /** Set disabled status */
  override setDisabledState(isDisabled: boolean) {
    super.setDisabledState(isDisabled);

    // Apply to service.
    this.radioGroupService.disabled = isDisabled;
  }

  /** Move to previous option */
  toPreviousOption(): void {
    if (!this.disabled) {
      const currentOptionIndex = findIndexFromQueryList(
        this.radioList,
        (radio) => radio.selected,
      );
      const previousOptionIndex = Math.max(currentOptionIndex - 1, 0);

      const previousOption = this.radioList?.get(previousOptionIndex);

      if (previousOption) {
        this.updateValue(previousOption.value);
      }
    }
  }

  /** Move to next option */
  toNextOption(): void {
    if (!this.disabled) {
      const currentOptionIndex = findIndexFromQueryList(
        this.radioList,
        (radio) => radio.selected,
      );
      const lastOptionIndex = (this.radioList?.length || 0) - 1;
      const nextOptionIndex = Math.min(currentOptionIndex + 1, lastOptionIndex);

      const nextOption = this.radioList?.get(nextOptionIndex);

      if (nextOption) {
        this.updateValue(nextOption.value);
      }
    }
  }

  /** Subscribe `selectOption` of `RadioComponent` */
  private subscribeSelectOption(): void {
    this.radioGroupService.selectOption
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (!this.disabled) {
          this.updateValue(value);
        }
      });
  }
}
