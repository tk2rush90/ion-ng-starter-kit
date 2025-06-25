import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  output,
} from '@angular/core';
import { AngularPlatform } from '../../../utils/platform.utils';

/** A directive to create element that can be detected when intersecting in view */
@Directive({
  selector: '[appIntersectionDetector]',
  standalone: true,
})
export class IntersectionDetectorDirective implements AfterViewInit, OnDestroy {
  /** Emits when host element is intersecting */
  intersect = output();

  /** Emits when host element is not intersecting */
  out = output();

  /** `IntersectionObserver` to intersecting status */
  private intersectionObserver?: IntersectionObserver;

  private readonly elementRef: ElementRef<HTMLElement> = inject(
    ElementRef<HTMLElement>,
  );

  ngAfterViewInit() {
    if (AngularPlatform.isBrowser) {
      // Create `IntersectionObserver`
      this.intersectionObserver = new IntersectionObserver((records) => {
        records.forEach((record) => {
          if (record.isIntersecting) {
            this.intersect.emit();
          } else {
            this.out.emit();
          }
        });
      });

      // Observe host element.
      this.intersectionObserver.observe(this.elementRef.nativeElement);
    }
  }

  ngOnDestroy() {
    // Disconnect on destroy.
    this.intersectionObserver?.disconnect();
  }
}
