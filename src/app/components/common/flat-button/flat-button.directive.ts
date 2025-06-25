import {
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { VariableColors } from '../../../utils/tailwind.utils';
import { FlatButtonMode } from '../../../types/flat-button-mode';
import { AngularPlatform } from '../../../utils/platform.utils';
import { FlatButtonSize } from '../../../types/flat-button-size';

@Directive({
  selector: '[appFlatButton]',
  host: {
    '[class]': `classes()`,
    class:
      'flex items-center [&.small]:h-8 [&.small]:text-sm [&.small]:px-3.5 justify-center gap-2 rounded-full h-10 px-5 transition-colors border-2 border-solid border-transparent',
  },
})
export class FlatButtonDirective implements OnDestroy {
  theme = input<VariableColors>('blue');

  mode = input<FlatButtonMode>('default');

  size = input<FlatButtonSize>('default');

  classes = computed(() => {
    const classes: any = {};

    const theme = this.theme();

    const mode = this.mode();

    const isDisabled = this.isDisabled();

    const size = this.size();

    if (isDisabled) {
      classes['bg-black/15'] = true;
      classes['text-black/30'] = true;
    } else if (mode === 'default') {
      classes[`bg-${theme}-500/10`] = true;
      classes[`hover:bg-${theme}-500/20`] = true;
      classes[`active:bg-${theme}-500/30`] = true;
      classes[`focus:border-${theme}-300`] = true;
      classes[`text-${theme}-500`] = true;
    } else if (mode === 'fill') {
      classes[`bg-${theme}-500`] = true;
      classes[`hover:brightness-110`] = true;
      classes[`active:brightness-120`] = true;
      classes[`focus:border-${theme}-900`] = true;
      classes[`text-white`] = true;
    } else if (mode === 'transparent') {
      classes[`hover:bg-${theme}-500/10`] = true;
      classes[`active:bg-${theme}-500/20`] = true;
      classes[`focus:border-${theme}-300`] = true;
      classes[`text-${theme}-500`] = true;
    }

    if (size === 'small') {
      classes['small'] = true;
    }

    return classes;
  });

  isDisabled = signal(false);

  private mutationObserver?: MutationObserver;

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  constructor() {
    if (AngularPlatform.isBrowser) {
      this.mutationObserver = new MutationObserver((records) => {
        records.forEach((record) => {
          const disabledAttribute = (record.target as HTMLElement).getAttribute(
            'disabled',
          );

          this.isDisabled.set(
            disabledAttribute === '' ||
              disabledAttribute?.toLowerCase() === 'true',
          );
        });
      });

      this.mutationObserver.observe(this.elementRef.nativeElement, {
        attributes: true,
      });
    }
  }

  ngOnDestroy() {
    this.mutationObserver?.disconnect();
  }
}
