import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { RadioGroupService } from '../../../services/app/radio-group/radio-group.service';
import { AppControlValueAccessor } from '../../../abstracts/app-control-value-accessor';
import { RadioComponent } from './radio/radio.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { findIndexFromQueryList } from '../../../utils/query-list.utils';
import { VariableColors } from '../../../utils/tailwind.utils';
import { RadioGroupDirection } from '../../../types/radio-group-direction';

/** Radio group allows selecting an option between multiple options */
@Component({
  selector: 'app-radio-group',
  imports: [],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss',
  host: {
    '(blur)': `onHostBlur()`,
    '(focus)': `onHostFocus()`,
    '(keydown.arrowUp)': 'onHostArrowUpKeydown($event)',
    '(keydown.arrowDown)': 'onHostArrowDownKeydown($event)',
    '(keydown.arrowLeft)': 'onHostArrowLeftKeydown($event)',
    '(keydown.arrowRight)': 'onHostArrowRightKeydown($event)',
    '[class]': `classes()`,
    tabindex: '0',
    class: 'flex gap-1',
  },
  providers: [RadioGroupService],
})
export class RadioGroupComponent extends AppControlValueAccessor {
  value = input<any>();

  theme = input<VariableColors | 'white'>('white');

  withBorder = input(false, {
    transform: booleanAttribute,
  });

  direction = input<RadioGroupDirection>('column');

  /** 초기 disabled 여부 설정 */
  disabled = input(false, {
    transform: booleanAttribute,
  });

  /** Emits when value has changed */
  valueChange = output<any>();

  /** Children of `RadioComponent` */
  radioList = contentChildren(RadioComponent);

  classes = computed(() => {
    const classes: any = {};

    const direction = this.direction();

    switch (direction) {
      case 'column': {
        classes['flex-col'] = true;
        classes['items-stretch'] = true;
        break;
      }

      case 'row': {
        classes['flex-row'] = true;
        classes['items-center'] = true;
        classes['flex-wrap'] = true;
        break;
      }
    }

    return classes;
  });

  private readonly destroyRef = inject(DestroyRef);

  private readonly radioGroupService = inject(RadioGroupService);

  constructor() {
    super();

    effect(() => {
      this.radioGroupService.value.set(this.value());
      this.setDisabledState(this.disabled());
    });

    this.subscribeSelectOption();
  }

  /** When blurred, mark as touched */
  onHostBlur(): void {
    this.onTouched();
    this.radioGroupService.focused.set(false);
  }

  /** When focused, update status in service */
  onHostFocus(): void {
    this.radioGroupService.focused.set(true);
  }

  /** Listen arrowUp keydown for accessibility */
  onHostArrowUpKeydown(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.toPreviousOption();
  }

  /** Listen arrowDown keydown for accessibility */
  onHostArrowDownKeydown(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.toNextOption();
  }

  /** Listen arrowLeft keydown for accessibility */
  onHostArrowLeftKeydown(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.toPreviousOption();
  }

  /** Listen arrowRight keydown for accessibility */
  onHostArrowRightKeydown(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.toNextOption();
  }

  /** Update `NgControl` and component values. Also, emits `valueChange` */
  override updateValue(value: any) {
    super.updateValue(value);
    this.valueChange.emit(value);
    this.radioGroupService.value.set(value);
  }

  /** Write value to component */
  override writeValue(obj: any) {
    this.value = obj;
  }

  /** Set disabled status */
  override setDisabledState(isDisabled: boolean) {
    super.setDisabledState(isDisabled);

    // Apply to service.
    this.radioGroupService.disabled.set(isDisabled);
  }

  /** Move to previous option */
  toPreviousOption(): void {
    if (!this.isDisabled()) {
      const currentOptionIndex = findIndexFromQueryList(
        this.radioList(),
        (radio) => radio.isSelected(),
      );

      const previousOptionIndex = Math.max(currentOptionIndex - 1, 0);

      const previousOption = this.radioList()![previousOptionIndex];

      if (previousOption) {
        this.updateValue(previousOption.value());
      }
    }
  }

  /** Move to next option */
  toNextOption(): void {
    if (!this.isDisabled()) {
      const currentOptionIndex = findIndexFromQueryList(
        this.radioList(),
        (radio) => radio.isSelected(),
      );

      const lastOptionIndex = (this.radioList()?.length || 0) - 1;

      const nextOptionIndex = Math.min(currentOptionIndex + 1, lastOptionIndex);

      const nextOption = this.radioList()![nextOptionIndex];

      if (nextOption) {
        this.updateValue(nextOption.value());
      }
    }
  }

  /** Subscribe `selectOption` of `RadioComponent` */
  private subscribeSelectOption(): void {
    this.radioGroupService.selectOption
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (!this.isDisabled()) {
          this.updateValue(value);
        }
      });
  }
}
