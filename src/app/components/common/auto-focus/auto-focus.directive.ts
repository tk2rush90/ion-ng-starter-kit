import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { isBrowser } from '../../../utils/platform';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit, OnDestroy {
  private focusTimeout: any;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    if (isBrowser()) {
      // NG0100 오류 방지를 위해 `setTimeout()` 사용
      this.focusTimeout = setTimeout(() => {
        this.elementRef.nativeElement.focus();
      });
    }
  }

  ngOnDestroy() {
    clearTimeout(this.focusTimeout);
  }
}
