import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { VariableColors } from '../../../utils/tailwind.utils';
import { IconButtonDirective } from '../icon-button/icon-button.directive';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { AngularPlatform } from '../../../utils/platform.utils';
import { NgStyle } from '@angular/common';
import { TabItemDirective } from '../tab-item/tab-item.directive';

/**
 * TabItemDirective를 이용해 탭 요소 구현하는 컴포넌트.
 * RouterLinkActive가 TabItemDirective에 있을 경우 라우트 변경에 따라 활성 탭 변경.
 * 아닐 경우, 클릭한 TabItemDirective를 활성화 처리.
 * 활성화 된 TabItemDirective는 tabChange output으로 방출.
 */
@Component({
  selector: 'app-tab-container',
  imports: [IconButtonDirective, LucideAngularModule, NgStyle],
  templateUrl: './tab-container.component.html',
  styleUrl: './tab-container.component.scss',
  host: {
    '(scroll)': `detectScroll()`,
    class: 'relative flex items-center justify-start gap-1 overflow-auto',
  },
})
export class TabContainerComponent implements OnInit, OnDestroy {
  theme = input<VariableColors>('blue');

  fill = input(false, {
    transform: booleanAttribute,
  });

  tabChange = output<TabItemDirective>();

  isScrollOnStart = signal(false);

  isScrollOnEnd = signal(false);

  hasScroll = signal(false);

  displayLeftButton = computed(
    () => this.hasScroll() && !this.isScrollOnStart(),
  );

  displayRightButton = computed(
    () => this.hasScroll() && !this.isScrollOnEnd(),
  );

  leftButtonStyles = signal({
    left: '0px',
  });

  rightButtonStyles = signal({
    right: '0px',
  });

  tabItemDirectiveList = contentChildren(TabItemDirective);

  private resizeObserver?: ResizeObserver;

  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  ngOnInit() {
    if (AngularPlatform.isBrowser) {
      this.resizeObserver = new ResizeObserver(() => this.detectScroll());

      this.resizeObserver.observe(this.elementRef.nativeElement);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  detectScroll(): void {
    const scrollLeft = this.elementRef.nativeElement.scrollLeft;

    const width = this.elementRef.nativeElement.offsetWidth;

    const scrollWidth = this.elementRef.nativeElement.scrollWidth;

    this.hasScroll.set(width < scrollWidth);
    this.isScrollOnStart.set(scrollLeft === 0);
    this.isScrollOnEnd.set(scrollLeft + width === scrollWidth);

    this.leftButtonStyles.set({
      left: `calc(${scrollLeft}px + 0.125rem)`,
    });

    this.rightButtonStyles.set({
      right: `calc(-${scrollLeft}px + 0.125rem)`,
    });
  }

  toLeft(): void {
    this.scrollBy(
      -this.elementRef.nativeElement.getBoundingClientRect().width / 2,
    );
  }

  toRight(): void {
    this.scrollBy(
      this.elementRef.nativeElement.getBoundingClientRect().width / 2,
    );
  }

  scrollBy(value: number): void {
    this.elementRef.nativeElement.scrollBy({
      left: value,
      behavior: 'smooth',
    });
  }

  protected readonly ChevronLeftIcon = ChevronLeftIcon;
  protected readonly ChevronRightIcon = ChevronRightIcon;
}
