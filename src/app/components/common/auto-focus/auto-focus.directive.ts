import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { AngularPlatformService } from '../../../services/app/angular-platform/angular-platform.service';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit, OnDestroy {
  private focusTimeout: any;

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  private readonly angularPlatformService = inject(AngularPlatformService);

  ngAfterViewInit() {
    if (this.angularPlatformService.isPlatformBrowser()) {
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
