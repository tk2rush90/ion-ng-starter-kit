import {
  computed,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { AngularPlatform } from '../../../utils/platform.utils';

/**
 * A directive to load image element.
 * When image it not loaded, it will be transparent.
 */
@Directive({
  selector: 'img[appImageHandler]',
  standalone: true,
  host: {
    '(error)': `onImageError()`,
    '(load)': `onImageLoad()`,
    '[class]': `classes()`,
    '[style]': `styles()`,
  },
  exportAs: 'imageHandler',
})
export class ImageHandlerDirective implements OnDestroy {
  /** Image successfully loaded status */
  imageLoaded = signal(false);

  imageError = signal(false);

  transition = signal(false);

  styles = computed(() => {
    return {
      opacity: this.imageLoaded() ? 1 : 0,
    };
  });

  classes = computed(() => {
    return {
      'transition-opacity': this.transition(),
      hidden: this.imageError(),
    };
  });

  private mutationObserver?: MutationObserver;

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  constructor() {
    if (AngularPlatform.isBrowser) {
      this.mutationObserver = new MutationObserver((records) => {
        records.forEach((_record) => {
          if (_record.attributeName?.toLowerCase() === 'src') {
            this.imageLoaded.set(false);
            this.imageError.set(false);
            this.transition.set(false);
          }
        });
      });

      this.mutationObserver.observe(this.elementRef.nativeElement, {
        attributes: true,
      });
    }
  }

  ngOnDestroy() {
    this.mutationObserver?.disconnect();
  }

  onImageLoad(): void {
    this.transition.set(true);
    this.imageLoaded.set(true);
    this.imageError.set(false);
  }

  onImageError(): void {
    this.imageError.set(true);
    this.imageLoaded.set(false);
  }
}
