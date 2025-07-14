import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { VariableColors } from '../../../utils/tailwind.utils';
import { AngularPlatform } from '../../../utils/platform.utils';
import { ChildNode } from 'postcss';
import { ChipMode } from '../../../types/chip-mode';

@Component({
  selector: 'app-chip',
  imports: [],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  host: {
    '[class]': `classes()`,
    '[tabindex]': `tabindex()`,
    class:
      'flex items-center justify-center rounded-full gap-2 text-sm h-7 border-2 border-solid border-transparent select-none transition-colors',
  },
})
export class ChipComponent implements OnInit, OnDestroy {
  theme = input<VariableColors>('blue');

  focusable = input(false, {
    transform: booleanAttribute,
  });

  mode = input<ChipMode>('default');

  classes = computed(() => {
    const theme = this.theme();

    const mode = this.mode();

    const isFillMode = mode === 'fill';

    const isDefaultMode = mode === 'default';

    const hasIcon = this.hasIcon();

    const hasPrefixedIcon = this.hasPrefixedIcon();

    const focusable = this.focusable();

    return {
      [`bg-${theme}-500/10`]: isDefaultMode,
      [`bg-${theme}-500`]: isFillMode,
      [`text-foreground/70`]: isDefaultMode,
      [`text-white`]: isFillMode,
      [`hover:bg-${theme}-500/20`]: focusable && isDefaultMode,
      [`active:bg-${theme}-500/30`]: focusable && isDefaultMode,
      [`focus:border-${theme}-300`]: focusable && isDefaultMode,
      [`hover:brightness-110`]: focusable && isFillMode,
      [`active:brightness-120`]: focusable && isFillMode,
      [`focus:border-${theme}-900`]: focusable && isFillMode,
      [`dark:focus:border-${theme}-300`]: focusable && isFillMode,
      'pl-1.5': hasIcon && hasPrefixedIcon,
      'pr-3': hasIcon && hasPrefixedIcon,
      'pr-1.5': hasIcon && !hasPrefixedIcon,
      'pl-3': hasIcon && !hasPrefixedIcon,
      'px-3': !hasIcon,
    };
  });

  hasIcon = signal(false);

  hasPrefixedIcon = signal(false);

  tabindex = computed(() => (this.focusable() ? '0' : '-1'));

  private mutationObserver?: MutationObserver;

  private readonly elementRef = inject(ElementRef);

  ngOnInit() {
    if (AngularPlatform.isBrowser) {
      this.mutationObserver = new MutationObserver(() => {
        this.hasIcon.set(false);
        this.hasPrefixedIcon.set(false);

        this.elementRef.nativeElement.childNodes.forEach(
          (child: ChildNode, index: number) => {
            if (
              child instanceof HTMLElement &&
              (child.tagName.toLowerCase() === 'i-lucide' ||
                child.classList.contains('app-icon'))
            ) {
              this.hasIcon.set(true);

              if (!this.hasPrefixedIcon()) {
                this.hasPrefixedIcon.set(index === 0);
              }
            }
          },
        );
      });

      this.mutationObserver.observe(this.elementRef.nativeElement, {
        childList: true,
        subtree: true,
      });
    }
  }

  ngOnDestroy() {
    this.mutationObserver?.disconnect();
  }
}
