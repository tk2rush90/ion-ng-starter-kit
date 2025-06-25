import { Directive, inject } from '@angular/core';
import { CarouselDirective } from '../carousel.directive';

@Directive({
  selector: '[appCarouselItem]',
  standalone: true,
  host: {
    '[class]': `classes`,
    '[style]': `styles`,
  },
})
export class CarouselItemDirective {
  transform = 'translateX(0)';

  private readonly carousel = inject(CarouselDirective);

  get classes(): any {
    const classes: any = {};

    if (this.carousel.isSlided && this.carousel.isSliding) {
      classes['pointer-events-none'] = true;
      classes['select-none'] = true;
    }

    return classes;
  }

  get styles(): any {
    return {
      transform: this.transform,
    };
  }
}
