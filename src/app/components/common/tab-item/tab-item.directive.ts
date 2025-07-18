import {
  AfterViewInit,
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TabContainerComponent } from '../tab-container/tab-container.component';
import { AngularPlatform } from '../../../utils/platform.utils';

@Directive({
  selector: '[appTabItem]',
  host: {
    '(click)': `onHostClick()`,
    '[class]': `classes()`,
    class:
      'flex items-center justify-center rounded-full border border-solid gap-2 px-5 h-12 transition-colors',
  },
})
export class TabItemDirective implements AfterViewInit {
  isActive = signal(false);

  classes = computed(() => {
    const theme = this.tabContainerComponent.theme();

    const fill = this.tabContainerComponent.fill();

    const isActive = this.isActive();

    return {
      'border-foreground/15': !isActive || !fill,
      'border-transparent': isActive && fill,
      'text-foreground': !isActive,
      'text-white': isActive && fill,
      [`text-${theme}-500`]: isActive && !fill,
      [`hover:bg-${theme}-500/10`]: !isActive,
      [`active:bg-${theme}-500/20`]: !isActive,
      [`bg-${theme}-500`]: isActive && fill,
      [`bg-${theme}-500/10`]: isActive && !fill,
    };
  });

  private readonly destroyRef = inject(DestroyRef);

  private readonly routerLinkActive = inject(RouterLinkActive, {
    optional: true,
  });

  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  private readonly tabContainerComponent = inject(TabContainerComponent);

  constructor() {
    effect(() => {
      // 서버사이드에서는 getBoundingClientRect()을 읽어올 수 없다
      if (
        this.isActive() &&
        AngularPlatform.isBrowser &&
        this.tabContainerComponent.scrollContainer
      ) {
        this.tabContainerComponent.tabChange.emit(this);

        const element = this.elementRef.nativeElement;

        const itemDomRect = element.getBoundingClientRect();

        const containerDomRect =
          this.tabContainerComponent.scrollContainer.getBoundingClientRect();

        if (itemDomRect.x < containerDomRect.x) {
          this.tabContainerComponent.scrollToLeftUntil(element);
          return;
        }

        if (itemDomRect.right > containerDomRect.right) {
          this.tabContainerComponent.scrollToRightUntil(element);
          return;
        }
      }
    });
  }

  ngAfterViewInit() {
    if (this.routerLinkActive) {
      this.routerLinkActive.isActiveChange
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((isActive) => this.isActive.set(isActive));
    }
  }

  /** RouterLinkActive가 없을 경우 단순 클릭 이벤트만으로 탭 활성화 감지 */
  onHostClick(): void {
    if (!this.routerLinkActive) {
      // 전체 비활성화 후 현재 아이템만 활성화
      this.tabContainerComponent
        .tabItemDirectiveList()
        .forEach((tabItemDirective) => tabItemDirective.isActive.set(false));

      this.isActive.set(true);
    }
  }
}
