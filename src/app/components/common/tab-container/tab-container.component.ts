import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { VariableColors } from '../../../utils/tailwind.utils';
import { IconButtonDirective } from '../icon-button/icon-button.directive';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { AngularPlatform } from '../../../utils/platform.utils';
import { TabItemDirective } from '../tab-item/tab-item.directive';

/**
 * TabItemDirective를 이용해 탭 요소 구현하는 컴포넌트.
 * RouterLinkActive가 TabItemDirective에 있을 경우 라우트 변경에 따라 활성 탭 변경.
 * 아닐 경우, 클릭한 TabItemDirective를 활성화 처리.
 * 활성화 된 TabItemDirective는 tabChange output으로 방출.
 */
@Component({
  selector: 'app-tab-container',
  imports: [IconButtonDirective, LucideAngularModule],
  templateUrl: './tab-container.component.html',
  styleUrl: './tab-container.component.scss',
  host: {
    class: 'relative flex flex-col items-stretch',
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

  scrollContainerElementRef =
    viewChild<ElementRef<HTMLElement>>('scrollContainer');

  displayLeftButton = computed(
    () => this.hasScroll() && !this.isScrollOnStart(),
  );

  displayRightButton = computed(
    () => this.hasScroll() && !this.isScrollOnEnd(),
  );

  tabItemDirectiveList = contentChildren(TabItemDirective);

  private resizeObserver?: ResizeObserver;

  get scrollContainer(): HTMLElement | undefined {
    return this.scrollContainerElementRef()?.nativeElement;
  }

  ngOnInit() {
    if (AngularPlatform.isBrowser && this.scrollContainer) {
      this.resizeObserver = new ResizeObserver(() => this.detectScroll());

      this.resizeObserver.observe(this.scrollContainer);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  detectScroll(): void {
    if (!this.scrollContainer) {
      return;
    }

    const scrollLeft = this.scrollContainer.scrollLeft;

    const width = this.scrollContainer.offsetWidth;

    const scrollWidth = this.scrollContainer.scrollWidth;

    this.hasScroll.set(width < scrollWidth);
    this.isScrollOnStart.set(scrollLeft === 0);
    this.isScrollOnEnd.set(scrollLeft + width === scrollWidth);
  }

  toLeft(): void {
    if (!this.scrollContainer) {
      return;
    }

    this.scrollBy(-(this.scrollContainer.getBoundingClientRect().width / 2));
  }

  toRight(): void {
    if (!this.scrollContainer) {
      return;
    }

    this.scrollBy(this.scrollContainer.getBoundingClientRect().width / 2);
  }

  scrollToLeftUntil(target: HTMLElement): void {
    if (!this.scrollContainer) {
      return;
    }

    this.scrollContainer.scrollTo({
      left: target.offsetLeft,
      behavior: 'smooth',
    });
  }

  scrollToRightUntil(target: HTMLElement): void {
    if (!this.scrollContainer) {
      return;
    }

    this.scrollContainer.scrollTo({
      left:
        target.offsetLeft +
        target.offsetWidth -
        this.scrollContainer.offsetWidth,
      behavior: 'smooth',
    });
  }

  scrollBy(value: number): void {
    if (!this.scrollContainer) {
      return;
    }

    this.scrollContainer.scrollBy({
      left: value,
      behavior: 'smooth',
    });
  }

  protected readonly ChevronLeftIcon = ChevronLeftIcon;
  protected readonly ChevronRightIcon = ChevronRightIcon;
}
