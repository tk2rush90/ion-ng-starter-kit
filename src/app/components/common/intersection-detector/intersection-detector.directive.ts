import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';
import { isBrowser } from '../../../utils/platform';

/** A directive to create element that can be detected when intersecting in view */
@Directive({
  selector: '[appIntersectionDetector]',
  standalone: true,
})
export class IntersectionDetectorDirective implements AfterViewInit, OnDestroy {
  /** Emits when host element is intersecting */
  @Output() intersect = new EventEmitter<void>();

  /** Emits when host element is not intersecting */
  @Output() out = new EventEmitter<void>();

  /** `IntersectionObserver` to intersecting status */
  private intersectionObserver?: IntersectionObserver;

  constructor(private readonly elementRef: ElementRef) {}

  ngAfterViewInit() {
    if (isBrowser()) {
      // Create `IntersectionObserver`
      this.intersectionObserver = new IntersectionObserver((records) => {
        records.forEach((_record) => {
          if (_record.isIntersecting) {
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
