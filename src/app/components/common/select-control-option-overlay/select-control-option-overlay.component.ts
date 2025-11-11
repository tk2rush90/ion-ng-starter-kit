import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { BackButtonHandler } from '../../../abstracts/back-button-handler';

@Component({
  selector: 'app-select-control-option-overlay',
  imports: [],
  templateUrl: './select-control-option-overlay.component.html',
  styleUrl: './select-control-option-overlay.component.scss',
  host: {
    '[style]': `styles()`,
    'animate.enter': 'fade-in',
    'animate.leave': 'fade-out',
    class:
      'flex flex-col items-stretch max-h-50 overflow-auto bg-white shadow-2xl pointer-events-auto fixed rounded-md outline outline-1 outline-black/30',
  },
})
export class SelectControlOptionOverlayComponent extends BackButtonHandler {
  parentHostElement = input.required<HTMLElement>();

  width = signal('');

  top = signal('');

  left = signal('');

  transform = signal('');

  styles = computed(() => {
    const width = this.width();

    const top = this.top();

    const left = this.left();

    const transform = this.transform();

    return {
      width,
      top,
      left,
      transform,
    };
  });

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    super();

    effect(() => {
      const parentHostElement = this.parentHostElement();

      const hostElement = this.elementRef.nativeElement;

      const parentHostDomRect = parentHostElement.getBoundingClientRect();

      const hostDomRect = hostElement.getBoundingClientRect();

      const isBottomOverflow =
        hostDomRect.height + parentHostDomRect.bottom > window.innerHeight;

      const isTopOverflow = parentHostDomRect.top - hostDomRect.height < 0;

      this.width.set(parentHostDomRect.width + 'px');

      this.left.set(parentHostDomRect.left + 'px');

      this.top.set('');

      this.transform.set('');

      if (isBottomOverflow) {
        if (isTopOverflow) {
          this.top.set(parentHostDomRect.bottom + 'px');
        } else {
          this.top.set(parentHostDomRect.top + 'px');
          this.transform.set('translateY(-100%)');
        }
      } else {
        this.top.set(parentHostDomRect.bottom + 'px');
      }
    });
  }
}
