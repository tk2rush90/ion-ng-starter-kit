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

    const isWhite = theme === 'white';

    const isDisabled = this.isDisabled();

    if (isDisabled) {
      classes['hover:bg-black/5'] = true;
    } else {
      if (isWhite) {
        classes['hover:backdrop-brightness-90'] = true;
        classes['active:backdrop-brightness-80'] = true;
        classes['dark:hover:backdrop-brightness-150'] = true;
        classes['dark:active:backdrop-brightness-200'] = true;
      } else {
        classes[`hover:bg-${theme}-500/5`] = true;
        classes[`active:bg-${theme}-500/10`] = true;
        classes[`dark:hover:bg-${theme}-500/10`] = true;
        classes[`dark:active:bg-${theme}-500/15`] = true;
      }
    }

    return classes;
  });

  buttonClasses = computed(() => {
    const classes: any = {};

    const theme = this.radioGroupComponent.theme();

    const isSelected = this.isSelected();

    const isDisabled = this.isDisabled();

    const isFocused = this.radioGroupService.focused();

    const withBorder = this.radioGroupComponent.withBorder();

    const isWhite = theme === 'white';

    if (isDisabled) {
      classes['text-black/30'] = true;
      classes['bg-black/30'] = isFocused;
      classes['bg-black/15'] = !isFocused;
      classes['border-transparent'] = true;
    } else {
      if (isWhite) {
        classes[`text-foreground`] = true;
        classes[`bg-white/70`] = isFocused;
        classes[`bg-white/50`] = !isFocused;
        classes[`border-foreground/30`] = isFocused && isSelected;
      } else {
        classes[`text-${theme}-500`] = true;
        classes[`bg-${theme}-500/30`] = isFocused;
        classes[`bg-${theme}-500/15`] = !isFocused;
        classes[`border-${theme}-500`] = isFocused && isSelected;
      }

      classes['border-transparent'] = !isFocused || !isSelected;
    }

    classes['outline'] = withBorder;
    classes['outline-1'] = withBorder;
    classes['outline-offset-[-1px]'] = withBorder;
    classes['outline-foreground/15'] = withBorder;

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
