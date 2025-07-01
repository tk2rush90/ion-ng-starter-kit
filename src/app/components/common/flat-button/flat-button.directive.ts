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
  theme = input<VariableColors | 'white'>('blue');

  mode = input<FlatButtonMode>('default');

  size = input<FlatButtonSize>('default');

  classes = computed(() => {
    const theme = this.theme();

    const mode = this.mode();

    const isDisabled = this.isDisabled();

    const size = this.size();

    const isWhite = theme === 'white';

    const isSmallSize = size === 'small';

    return {
      'bg-foreground/15': isDisabled,
      'text-foreground/30': isDisabled,
      // mode === 'default'
      [`bg-${theme}-500/10`]: !isDisabled && mode === 'default' && !isWhite,
      [`hover:bg-${theme}-500/20`]:
        !isDisabled && mode === 'default' && !isWhite,
      [`active:bg-${theme}-500/30`]:
        !isDisabled && mode === 'default' && !isWhite,
      [`focus:border-${theme}-300`]:
        !isDisabled &&
        (mode === 'default' || mode === 'transparent') &&
        !isWhite,
      [`text-${theme}-500`]: !isDisabled && mode === 'default' && !isWhite,
      [`bg-white/10`]: !isDisabled && mode === 'default' && isWhite,
      [`hover:bg-foreground/20`]:
        !isDisabled &&
        (mode === 'default' || mode === 'transparent') &&
        isWhite,
      [`active:bg-foreground/30`]:
        !isDisabled &&
        (mode === 'default' || mode === 'transparent') &&
        isWhite,
      [`text-foreground`]:
        !isDisabled &&
        (mode === 'default' || mode === 'transparent') &&
        isWhite,
      [`dark:focus:border-foreground/50`]:
        !isDisabled &&
        (mode === 'default' || mode === 'transparent') &&
        isWhite,
      // mode === 'fill'
      [`bg-${theme}-500`]: !isDisabled && mode === 'fill' && !isWhite,
      [`hover:brightness-110`]: !isDisabled && mode === 'fill' && !isWhite,
      [`active:brightness-120`]: !isDisabled && mode === 'fill' && !isWhite,
      [`focus:border-${theme}-900`]: !isDisabled && mode === 'fill' && !isWhite,
      [`dark:focus:border-${theme}-300`]:
        !isDisabled && mode === 'fill' && !isWhite,
      [`text-white`]: !isDisabled && mode === 'fill' && !isWhite,
      [`bg-white`]: !isDisabled && mode === 'fill' && isWhite,
      [`dark:text-background`]: !isDisabled && mode === 'fill' && isWhite,
      [`hover:brightness-90`]: !isDisabled && mode === 'fill' && isWhite,
      [`active:brightness-80`]: !isDisabled && mode === 'fill' && isWhite,
      [`dark:focus:border-background/50`]:
        !isDisabled && mode === 'fill' && isWhite,
      // mode === 'transparent'
      [`hover:bg-${theme}-500/10`]:
        !isDisabled && mode === 'transparent' && !isWhite,
      [`active:bg-${theme}-500/20`]:
        !isDisabled && mode === 'transparent' && !isWhite,
      [`text-${theme}-500`]: !isDisabled && mode === 'transparent' && !isWhite,
      // size === 'small'
      small: isSmallSize,
    };
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
