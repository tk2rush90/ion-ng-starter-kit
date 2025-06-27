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

  fill = input(false, {
    transform: booleanAttribute,
  });

  classes = computed(() => {
    const theme = this.theme();

    const fill = this.fill();

    const hasIcon = this.hasIcon();

    const hasPrefixedIcon = this.hasPrefixedIcon();

    const focusable = this.focusable();

    return {
      [`bg-${theme}-500/10`]: !fill,
      [`bg-${theme}-500`]: fill,
      [`text-${theme}-500`]: !fill,
      [`text-white`]: fill,
      [`hover:bg-${theme}-500/20`]: focusable && !fill,
      [`active:bg-${theme}-500/30`]: focusable && !fill,
      [`focus:border-${theme}-300`]: focusable && !fill,
      [`hover:brightness-110`]: focusable && fill,
      [`active:brightness-120`]: focusable && fill,
      [`focus:border-${theme}-900`]: focusable && fill,
      [`dark:focus:border-${theme}-300`]: focusable && fill,
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
