import {
  computed,
  contentChildren,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  numberAttribute,
  OnDestroy,
} from '@angular/core';
import { CarouselItemDirective } from './carousel-item/carousel-item.directive';
import { AngularPlatform } from '../../../utils/platform.utils';
import anime, { AnimeInstance } from 'animejs';
import { Platform } from '@ionic/angular/standalone';

@Directive({
  selector: '[appCarousel]',
  standalone: true,
  exportAs: 'carousel',
  host: {
    '(window:mouseup)': `stopSliding($event)`,
    '(window:pointerup)': `stopSliding($event)`,
    '(window:pointerleave)': `stopSliding($event)`,
    '(window:pointercancel)': `stopSliding($event)`,
  },
})
export class CarouselDirective implements OnDestroy {
  gap = input(0, {
    transform: numberAttribute,
  });

  itemWidth = input(0, {
    transform: numberAttribute,
  });

  carouselItemDirectives = contentChildren(CarouselItemDirective);

  startX = 0;

  movedX = 0;

  storedX = 0;

  isSliding = false;

  isSlided = false;

  slideIndex = 0;

  width = computed(() => {
    return this.itemWidth() > 0
      ? this.itemWidth()
      : this.elementRef.nativeElement.offsetWidth;
  });

  transform = computed(() => {
    return `translate(${this.storedX + this.movedX - this.startX + this.slideIndex * -this.gap()}px)`;
  });

  private resizeTimer: any;

  private animeInstance?: AnimeInstance;

  private readonly elementRef = inject(ElementRef<HTMLDivElement>);

  private readonly platform = inject(Platform);

  constructor() {
    this.startSliding = this.startSliding.bind(this);
    this.moveSlide = this.moveSlide.bind(this);

    if (AngularPlatform.isBrowser) {
      this.elementRef.nativeElement.addEventListener(
        'mousedown',
        this.startSliding,
      );
      this.elementRef.nativeElement.addEventListener(
        'mousemove',
        this.moveSlide,
      );
      this.elementRef.nativeElement.addEventListener(
        'touchstart',
        this.startSliding,
        { passive: false },
      );
      this.elementRef.nativeElement.addEventListener(
        'touchmove',
        this.moveSlide,
        { passive: false },
      );
    }
  }

  get carouselItemsLength(): number {
    return this.carouselItemDirectives()?.length || 0;
  }

  ngOnDestroy() {
    if (AngularPlatform.isBrowser) {
      this.elementRef.nativeElement.removeEventListener(
        'mousedown',
        this.startSliding,
      );
      this.elementRef.nativeElement.removeEventListener(
        'mousemove',
        this.moveSlide,
      );
      this.elementRef.nativeElement.removeEventListener(
        'touchstart',
        this.startSliding,
      );
      this.elementRef.nativeElement.removeEventListener(
        'touchmove',
        this.moveSlide,
      );
    }

    clearTimeout(this.resizeTimer);

    this.pause();

    delete this.animeInstance;
  }

  startSliding(event: MouseEvent | TouchEvent): void {
    this.isSliding = true;

    this.pause();

    if (event instanceof MouseEvent) {
      this.startX = event.x;
    } else {
      this.startX = event.touches[0].pageX;
    }

    this.movedX = this.startX;
  }

  moveSlide(event: MouseEvent | TouchEvent): void {
    if (this.isSliding) {
      if (event instanceof MouseEvent) {
        this.movedX = event.x;
      } else {
        this.movedX = event.touches[0].pageX;
      }

      if (Math.abs(this.movedX - this.startX) > 5) {
        this.isSlided = true;
      }
    }

    if (this.isSlided && event.cancelable) {
      event.preventDefault();
    }

    this.updateCarouselTransform();
  }

  @HostListener('window:resize')
  repositionPages(): void {
    clearTimeout(this.resizeTimer);

    this.resizeTimer = setTimeout(() => {
      this.storedX = -this.slideIndex * this.width();

      this.updateCarouselTransform();
    }, 10);
  }

  stopSliding(event: Event): void {
    if (this.isSliding) {
      this.isSliding = false;
      this.isSlided = false;
      this.storedX += this.movedX - this.startX;

      if (
        (this.movedX - this.startX === 0 && this.platform.is('mobile')) ||
        this.platform.is('tablet')
      ) {
        const anchors = this.elementRef.nativeElement.querySelectorAll('a');

        for (let i = anchors.length - 1; i >= 0; i--) {
          const anchor = anchors[i];

          if (
            anchor === event.target ||
            anchor.contains(event.target as HTMLElement)
          ) {
            anchor.click();
            break;
          }
        }

        return;
      }

      const canMove =
        Math.abs((this.movedX - this.startX) / this.width()) > 0.2;
      const isLeft = this.movedX - this.startX > 0;

      this.movedX = 0;
      this.startX = 0;

      if (this.storedX > 0) {
        this.animate(0);
      } else if (
        this.storedX + this.movedX <
        this.width() * -(this.carouselItemsLength - 1)
      ) {
        this.animate(this.width() * -(this.carouselItemsLength - 1));
      } else {
        const currentX = this.storedX / this.width();

        if (canMove) {
          if (isLeft) {
            this.animate(this.width() * Math.ceil(currentX));
          } else {
            this.animate(this.width() * Math.floor(currentX));
          }
        } else {
          this.animate(this.width() * -this.slideIndex);
        }
      }
    }
  }

  animate(to: number): void {
    this.animeInstance = anime({
      targets: this,
      storedX: to,
      duration: 300,
      easing: 'easeOutCirc',
      change: () => {
        this.updateCarouselTransform();
        this.updateSlideIndex();
      },
    });
  }

  pause(): void {
    this.animeInstance?.pause();
  }

  updateSlideIndex(): void {
    const movedX = Math.min(
      Math.max(this.storedX / this.width(), -this.carouselItemsLength),
      0,
    );

    this.slideIndex = Math.round(Math.abs(movedX));
  }

  updateCarouselTransform(): void {
    this.carouselItemDirectives()?.forEach(
      (_carouselItemDirective) =>
        (_carouselItemDirective.transform = this.transform()),
    );
  }
}
