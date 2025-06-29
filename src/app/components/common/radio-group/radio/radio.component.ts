import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RadioGroupService } from '../../../../services/app/radio-group/radio-group.service';
import { RadioGroupComponent } from '../radio-group.component';
import { NgClass } from '@angular/common';
import { fadeInOut } from '../../../../animations/fade-in-out';

/** A component which can be used as an option for `RadioGroupComponent` */
@Component({
  selector: 'app-radio',
  imports: [NgClass],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  host: {
    '(click)': `onHostClick()`,
    '[class]': `classes()`,
    class:
      'flex cursor-pointer select-none items-center justify-between gap-2 px-3 min-h-10 rounded-[1.25rem] py-2 transition-colors',
  },
  animations: [fadeInOut()],
})
export class RadioComponent {
  /** Value of radio to apply when selected */
  value = input.required<any>();

  /** Selected status */
  isSelected = signal(false);

  isDisabled = signal(false);

  /** 호스트 클래스 생성 이펙트 */
  classes = computed(() => {
    const classes: any = {};

    const theme = this.radioGroupComponent.theme();

    const isDisabled = this.isDisabled();

    if (isDisabled) {
      classes['hover:bg-black/5'] = true;
    } else {
      classes[`hover:bg-${theme}-500/5`] = true;
      classes[`active:bg-${theme}-500/10`] = true;
      classes[`dark:hover:bg-${theme}-500/10`] = true;
      classes[`dark:active:bg-${theme}-500/15`] = true;
    }

    return classes;
  });

  buttonClasses = computed(() => {
    const classes: any = {};

    const theme = this.radioGroupComponent.theme();

    const isSelected = this.isSelected();

    const isDisabled = this.isDisabled();

    const isFocused = this.radioGroupService.focused();

    if (isDisabled) {
      classes['text-black/30'] = true;

      if (isFocused) {
        classes['bg-black/30'] = true;
      } else {
        classes['bg-black/15'] = true;
      }

      if (isSelected && isFocused) {
        classes['border-foreground/15'] = true;
      } else {
        classes['border-transparent'] = true;
      }
    } else {
      classes[`text-${theme}-500`] = true;

      if (isFocused) {
        classes[`bg-${theme}-500/30`] = true;
      } else {
        classes[`bg-${theme}-500/15`] = true;
      }

      if (isSelected && isFocused) {
        classes[`border-${theme}-500`] = true;
      } else {
        classes['border-transparent'] = true;
      }
    }

    return classes;
  });

  private readonly radioGroupComponent = inject(RadioGroupComponent);

  private readonly radioGroupService = inject(RadioGroupService);

  constructor() {
    effect(() => {
      this.isSelected.set(this.radioGroupService.value() === this.value());
      this.isDisabled.set(this.radioGroupService.disabled());
    });
  }

  onHostClick(): void {
    this.radioGroupService.selectOption.emit(this.value());
  }
}
