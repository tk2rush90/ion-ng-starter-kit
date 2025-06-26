import {
  booleanAttribute,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { AppControlValueAccessor } from '../../../abstracts/app-control-value-accessor';
import { CheckboxService } from '../../../services/app/checkbox/checkbox.service';
import { CheckIcon, LucideAngularModule } from 'lucide-angular';
import { NgClass } from '@angular/common';
import { VariableColors } from '../../../utils/tailwind.utils';
import { fadeInOut } from '../../../animations/fade-in-out';

/** A component of checkbox with label and button */
@Component({
  selector: 'app-checkbox',
  imports: [LucideAngularModule, NgClass],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  host: {
    '(click)': `onHostClick()`,
    '(focus)': `onHostFocus()`,
    '(blur)': `onHostBlur()`,
    '(keydown.space)': `onHostSpaceKeydown($event)`,
    '[attr.aria-checked]': 'isChecked()',
    '[attr.data-theme]': `theme()`,
    '[class]': `classes()`,
    class:
      'flex cursor-pointer select-none items-center justify-between gap-2 px-3 min-h-10 rounded-[1.25rem] py-2 transition-colors',
    tabindex: '0',
    role: 'checkbox',
  },
  providers: [CheckboxService],
  animations: [
    fadeInOut({
      fadeIn: '.1s',
      fadeOut: '.1s',
    }),
  ],
})
export class CheckboxComponent extends AppControlValueAccessor {
  theme = input<VariableColors>('blue');

  /** 초기 disabled 상태 설정 */
  disabled = input(false, {
    transform: booleanAttribute,
  });

  /** 초기 체크 상태 설정 */
  checked = input(false, {
    transform: booleanAttribute,
  });

  /** Emits when `checked` status has changed */
  checkedChange = output<boolean>();

  /** 실제 체크 상태 */
  isChecked = computed(() => this.checkboxService.checked());

  /** 호스트 클래스 생성 이펙트 */
  classes = computed(() => {
    const classes: any = {};

    const theme = this.theme();

    const disabled = this.checkboxService.disabled();

    if (disabled) {
      classes['hover:bg-black/5'] = true;
    } else {
      classes[`hover:bg-${theme}-500/5`] = true;
      classes[`active:bg-${theme}-500/10`] = true;
    }

    return classes;
  });

  /** 체크박스 버튼 클래스 */
  buttonClasses = computed(() => {
    const classes: any = {};

    const theme = this.theme();

    const disabled = this.checkboxService.disabled();

    const focused = this.checkboxService.focused();

    if (disabled) {
      classes['bg-black/15'] = true;
      classes['text-black/30'] = true;

      if (focused) {
        classes[`border-black/15`] = true;
      } else {
        classes['border-transparent'] = true;
      }
    } else {
      classes[`bg-${theme}-100`] = true;
      classes[`text-${theme}-500`] = true;

      if (focused) {
        classes[`border-${theme}-500`] = true;
      } else {
        classes['border-transparent'] = true;
      }
    }

    return classes;
  });

  private readonly checkboxService = inject(CheckboxService);

  constructor() {
    super();

    effect(() => {
      this.setDisabledState(this.disabled());
      this.checkboxService.checked.set(this.checked());
    });
  }

  /** Listen click event to toggle checked status */
  onHostClick(): void {
    this.toggle();
  }

  /** Listen focus event to set `focused` status of service */
  onHostFocus(): void {
    this.checkboxService.focused.set(true);
  }

  /** Listen blur event to mark as touched */
  onHostBlur(): void {
    this.onTouched();

    this.checkboxService.focused.set(false);
  }

  /** Listen space keydown for accessibility */
  onHostSpaceKeydown(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.toggle();
  }

  /** Write value to component */
  override writeValue(obj: any) {
    this.checkboxService.checked.set(obj);
  }

  /** Update `NgControl` and component values. Also, emits `valueChange` */
  override updateValue(value: any) {
    super.updateValue(value);
    this.checkedChange.emit(value);
  }

  /** Set disabled status */
  override setDisabledState(isDisabled: boolean) {
    super.setDisabledState(isDisabled);

    // Apply to service.
    this.checkboxService.disabled.set(isDisabled);
  }

  /** Check the checkbox */
  check(): void {
    if (this.disabled()) {
      return;
    }

    this.updateValue(true);
  }

  /** Uncheck the checkbox */
  uncheck(): void {
    if (this.disabled()) {
      return;
    }

    this.updateValue(false);
  }

  /** Toggle checked status */
  toggle(): void {
    if (this.isChecked()) {
      this.uncheck();
    } else {
      this.check();
    }
  }

  protected readonly CheckIcon = CheckIcon;
}
