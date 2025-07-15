import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { ColorWeight, VariableColors } from '../../../utils/tailwind.utils';
import { ButtonMode } from '../../../types/button-mode';
import { AngularPlatform } from '../../../utils/platform.utils';
import { ButtonSize } from '../../../types/button-size';

@Directive({
  selector: '[appButton]',
  host: {
    '[class]': `classes()`,
    class:
      'flex items-center justify-center gap-2 rounded-full transition-colors border-2 border-solid border-transparent',
  },
})
export class ButtonDirective implements OnDestroy {
  theme = input<VariableColors | 'white'>('blue');

  mode = input<ButtonMode>('default');

  size = input<ButtonSize>('default');

  weight = input<ColorWeight>('500');

  withBorder = input(false, {
    transform: booleanAttribute,
  });

  classes = computed(() => {
    const theme = this.theme();

    const mode = this.mode();

    const isDisabled = this.isDisabled();

    const size = this.size();

    const isWhite = theme === 'white';

    const isSmallSize = size === 'small';

    const isDefaultSize = size === 'default';

    const isLargeSize = size === 'large';

    const isFillMode = mode === 'fill';

    const isTransparentMode = mode === 'transparent';

    const isDefaultMode = mode === 'default';

    const withBorder = this.withBorder();

    const weight = this.weight();

    const classes: any = {};

    if (isDisabled) {
      classes['bg-foreground/15'] = true;
      classes['text-foreground/30'] = true;
    } else {
      if (isWhite) {
        classes['bg-white'] = isFillMode;
        classes['bg-white/50'] = isDefaultMode;
        classes['text-foreground'] = true; // 항상 적용.
        classes['dark:text-background'] = isFillMode;
        classes['hover:brightness-90'] = !isTransparentMode;
        classes['active:brightness-80'] = !isTransparentMode;
        classes['hover:backdrop-brightness-90'] = isTransparentMode;
        classes['active:backdrop-brightness-80'] = isTransparentMode;
        classes['dark:focus:border-background/20'] = isFillMode;
        classes['dark:hover:backdrop-brightness-150'] = isTransparentMode;
        classes['dark:active:backdrop-brightness-200'] = isTransparentMode;
        classes['dark:focus:border-foreground/50'] =
          isTransparentMode || isDefaultMode;
      } else {
        classes[`bg-${theme}-${weight}/10`] = isDefaultMode;
        classes[`hover:bg-${theme}-${weight}/20`] = isDefaultMode;
        classes[`active:bg-${theme}-${weight}/30`] = isDefaultMode;
        classes[`focus:border-${theme}-300`] =
          isDefaultMode || isTransparentMode;
        classes[`text-${theme}-${weight}`] = isDefaultMode;
        classes[`bg-${theme}-${weight}`] = isFillMode;
        classes[`hover:brightness-110`] = isFillMode;
        classes[`active:brightness-120`] = isFillMode;
        classes[`focus:border-${theme}-900`] = isFillMode;
        classes[`dark:focus:border-${theme}-300`] = isFillMode;
        classes[`text-white`] = isFillMode;
        classes[`hover:bg-${theme}-${weight}/10`] = isTransparentMode;
        classes[`active:bg-${theme}-${weight}/20`] = isTransparentMode;
        classes[`text-${theme}-${weight}`] = isTransparentMode;
      }
    }

    classes['outline'] = withBorder;
    classes['outline-1'] = withBorder;
    classes['outline-offset-[-1px]'] = withBorder;
    classes['outline-foreground/15'] = withBorder;
    classes['h-10'] = isSmallSize;
    classes['text-sm'] = isSmallSize;
    classes['px-3.5'] = isSmallSize;
    classes['h-12'] = isDefaultSize;
    classes['text-base'] = isDefaultSize;
    classes['px-5'] = isDefaultSize;
    classes['h-14'] = isLargeSize;
    classes['text-lg'] = isLargeSize;
    classes['px-6.5'] = isLargeSize;

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
