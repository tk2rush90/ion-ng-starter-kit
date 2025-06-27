import {
  AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { SideBarContainerComponent } from '../side-bar-container/side-bar-container.component';
import { SideBarPosition } from '../../../types/side-bar-position';
import { AngularPlatform } from '../../../utils/platform.utils';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  host: {
    '[class]': `classes()`,
    '[style]': `styles()`,
    class:
      'absolute flex-col items-stretch transition-all h-full bg-white dark:bg-dark-background',
  },
})
export class SideBarComponent implements AfterViewInit, OnDestroy {
  position = input.required<SideBarPosition>();

  /** 사이드바 닫힐 때 유지할 넓이를 CSS 값으로 설정하여, 닫힘 상태일 때도 살짝 튀어나온 모습 등 처리 가능 */
  keepSize = input<string>();

  /** 사이드바가 열릴 때 컨텐츠 영역 위로 표시될 지, 컨텐츠를 밀고 표시될 지 설정 */
  overlapContent = input(false, {
    transform: booleanAttribute,
  });

  withBorder = input(false, {
    transform: booleanAttribute,
  });

  withShadow = input(false, {
    transform: booleanAttribute,
  });

  classes = computed(() => {
    const withBorder = this.withBorder();

    const withShadow = this.withShadow();

    const position = this.position();

    const isLeftPosition = position === 'left';

    const isRightPosition = position === 'right';

    return {
      'left-0': isLeftPosition,
      'right-0': isRightPosition,
      'border-r': withBorder && isLeftPosition,
      'border-l': withBorder && isRightPosition,
      'border-black/15': withBorder,
      'dark:border-white/15': withBorder,
      'shadow-2xl': withShadow,
    };
  });

  styles = computed(() => {
    const position = this.position();

    const isOpened = this.isOpened();

    const targetX = position === 'left' ? '-100%' : '100%';

    const keepSize = this.keepSize();

    const keepSizeOperator = position === 'left' ? '+' : '-';

    return {
      transform: isOpened
        ? 'translateX(0)'
        : `translateX(calc(${targetX} ${keepSizeOperator} ${keepSize || '0px'}))`,
    };
  });

  isOpened = computed(() => this.sideBarContainerComponent.isOpened());

  domRect = signal<DOMRect | null>(null);

  private resizeObserver?: ResizeObserver;

  private readonly elementRef = inject(ElementRef);

  private readonly sideBarContainerComponent = inject(
    SideBarContainerComponent,
  );

  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  ngAfterViewInit() {
    if (AngularPlatform.isBrowser) {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.domRect.set(entry.contentRect);
        });
      });

      this.resizeObserver.observe(this.element);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  open(): void {
    this.sideBarContainerComponent.isOpened.set(true);
  }

  close(): void {
    this.sideBarContainerComponent.isOpened.set(false);
  }

  toggle(): void {
    if (this.isOpened()) {
      this.close();
    } else {
      this.open();
    }
  }
}
