import {
  AfterViewInit,
  booleanAttribute,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import { OverlayRef } from '../../../services/app/overlay/overlay.service';
import { IconXMarkComponent } from '../../icons/icon-x-mark/icon-x-mark.component';
import anime, { AnimeInstance } from 'animejs';

@Component({
  selector: 'app-bottom-sheet',
  imports: [IconXMarkComponent],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
  host: {
    '[style.top]': `isDragging ? top + 'px' : ''`,
  },
})
export class BottomSheetComponent implements AfterViewInit, OnDestroy {
  @Input() modalTitle = '';

  @Input({ transform: booleanAttribute }) displayCloseButton = false;

  isScrolled = false;

  isDragging = false;

  isDragMoved = false;

  initialTop = 0;

  startDragY = 0;

  moveDragY = 0;

  private scrollDetectTimeout: any;

  private cancelMouseMove?: () => void;

  private cancelTouchMove?: () => void;

  private cancelMouseUp?: () => void;

  private cancelTouchEnd?: () => void;

  private cancelTouchCancel?: () => void;

  private animeInstance?: AnimeInstance;

  constructor(
    @Inject(OVERLAY_REF) private readonly overlayRef: OverlayRef,
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  @HostBinding('class.max-h-[calc(100dvh-56px-16px)]')
  get limitMaxHeight(): boolean {
    return !this.isDragging;
  }

  get top(): number {
    return this.isDragMoved
      ? this.initialTop + (this.moveDragY - this.startDragY)
      : this.initialTop;
  }

  ngAfterViewInit() {
    this.scrollDetectTimeout = setTimeout(() => this.detectScroll());
  }

  ngOnDestroy() {
    clearTimeout(this.scrollDetectTimeout);

    this.animeInstance?.pause();
  }

  @HostListener('scroll')
  detectScroll(): void {
    this.isScrolled = this.elementRef.nativeElement.scrollTop > 0;
  }

  startDrag(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) {
      if (event instanceof MouseEvent) {
        this.startDragY = event.y;
      } else {
        this.startDragY = event.touches[0].clientY;
      }

      this.initialTop =
        this.elementRef.nativeElement.getBoundingClientRect().top;
      this.moveDragY = this.startDragY;
      this.isDragging = true;
      this.isDragMoved = false;

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

    this.isDragMoved = true;

    if (event instanceof MouseEvent) {
      this.moveDragY = event.y;
    } else {
      this.moveDragY = event.touches[0].clientY;
    }
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

    if (this.moveDragY - this.initialTop > 56) {
      this.close();
    } else {
      // 원상복구
      this.animeInstance = anime({
        targets: this,
        moveDragY: this.startDragY,
        duration: 250,
        easing: 'easeOutCirc',
        complete: () => {
          this.isDragging = false;
          this.isDragMoved = false;
        },
      });
    }
  }

  close(): void {
    this.overlayRef.close();
  }
}
