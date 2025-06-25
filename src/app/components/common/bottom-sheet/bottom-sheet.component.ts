import {
  AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Renderer2,
  signal,
} from '@angular/core';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import anime, { AnimeInstance } from 'animejs';
import { LucideAngularModule, XIcon } from 'lucide-angular';
import { spacingToRem } from '../../../utils/tailwind.utils';
import { NgClass } from '@angular/common';
import { IconButtonDirective } from '../icon-button/icon-button.directive';

@Component({
  selector: 'app-bottom-sheet',
  imports: [LucideAngularModule, NgClass, IconButtonDirective],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
  host: {
    '(scroll)': `detectScroll()`,
    '[style]': `styles()`,
    class:
      'pointer-events-auto fixed bottom-0 left-0 right-0 flex w-full flex-col items-stretch overflow-auto rounded-t-3xl bg-white shadow-lg md:bottom-4 md:left-1/2 md:w-[calc(100dvw-2rem)] md:rounded-3xl',
  },
})
export class BottomSheetComponent implements AfterViewInit, OnDestroy {
  modalTitle = input('');

  displayCloseButton = input(false, {
    transform: booleanAttribute,
  });

  isScrolled = signal(false);

  isDragging = signal(false);

  isDragMoved = signal(false);

  initialTop = signal(0);

  startDragY = signal(0);

  moveDragY = signal(0);

  styles = computed(() => {
    const styles: any = {};

    if (!this.isDragging()) {
      styles.maxHeight = `calc(100dvh-${spacingToRem(14)}rem-${spacingToRem(4)}rem)`;
    }

    if (this.isDragMoved()) {
      styles.top =
        this.initialTop() + (this.moveDragY() - this.startDragY()) + 'px';
    }

    return styles;
  });

  /** AnimeJS를 이용한 애니메이션 실행을 위한 필드 */
  animatableMoveDragY = 0;

  private scrollDetectTimeout: any;

  private cancelMouseMove?: () => void;

  private cancelTouchMove?: () => void;

  private cancelMouseUp?: () => void;

  private cancelTouchEnd?: () => void;

  private cancelTouchCancel?: () => void;

  private animeInstance?: AnimeInstance;

  private readonly overlayRef = inject(OVERLAY_REF);

  private readonly renderer = inject(Renderer2);

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  ngAfterViewInit() {
    this.scrollDetectTimeout = setTimeout(() => this.detectScroll());
  }

  ngOnDestroy() {
    clearTimeout(this.scrollDetectTimeout);

    this.animeInstance?.pause();
  }

  detectScroll(): void {
    this.isScrolled.set(this.elementRef.nativeElement.scrollTop > 0);
  }

  startDrag(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging()) {
      if (event instanceof MouseEvent) {
        this.startDragY.set(event.y);
      } else {
        this.startDragY.set(event.touches[0].clientY);
      }

      this.initialTop.set(
        this.elementRef.nativeElement.getBoundingClientRect().top,
      );
      this.moveDragY.set(this.startDragY());
      this.isDragging.set(true);
      this.isDragMoved.set(false);

      this.cancelMouseMove = this.renderer.listen(
        window,
        'mousemove',
        (event: MouseEvent) => this.moveDrag(event),
      );

      this.cancelTouchMove = this.renderer.listen(
        window,
        'touchmove',
        (event: MouseEvent) => this.moveDrag(event),
        {
          passive: false,
        },
      );

      this.cancelMouseUp = this.renderer.listen(window, 'mouseup', () =>
        this.stopDrag(),
      );

      this.cancelTouchEnd = this.renderer.listen(window, 'touchend', () =>
        this.stopDrag(),
      );

      this.cancelTouchCancel = this.renderer.listen(window, 'touchcancel', () =>
        this.stopDrag(),
      );
    }
  }

  moveDrag(event: MouseEvent | TouchEvent): void {
    if (event.cancelable) {
      event.preventDefault();
    }

    this.isDragMoved.set(true);

    if (event instanceof MouseEvent) {
      this.moveDragY.set(event.y);
    } else {
      this.moveDragY.set(event.touches[0].clientY);
    }

    console.log(this.moveDragY());

    console.log(this.styles());
  }

  stopDrag(): void {
    if (this.cancelMouseMove) {
      this.cancelMouseMove();
    }

    if (this.cancelTouchMove) {
      this.cancelTouchMove();
    }

    if (this.cancelMouseUp) {
      this.cancelMouseUp();
    }

    if (this.cancelTouchEnd) {
      this.cancelTouchEnd();
    }

    if (this.cancelTouchCancel) {
      this.cancelTouchCancel();
    }

    this.animeInstance?.pause();

    if (this.moveDragY() - this.initialTop() > 56) {
      this.close();
    } else {
      this.animatableMoveDragY = this.moveDragY();

      // 원상복구
      this.animeInstance = anime({
        targets: this,
        animatableMoveDragY: this.startDragY(),
        duration: 250,
        easing: 'easeOutCirc',
        // 업데이트 될 때마다 animatableMoveDragY 값 시그널에 반영
        update: () => this.moveDragY.set(this.animatableMoveDragY),
        complete: () => {
          this.isDragging.set(false);
          this.isDragMoved.set(false);
        },
      });
    }
  }

  close(): void {
    this.overlayRef.close();
  }

  protected readonly XIcon = XIcon;
}
