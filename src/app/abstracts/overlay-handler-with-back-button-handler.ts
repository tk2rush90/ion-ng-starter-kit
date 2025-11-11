import { BackButtonHandler } from './back-button-handler';
import { Component, DestroyRef, inject, TemplateRef } from '@angular/core';
import { OVERLAY_REF } from '../tokens/overlay-ref';
import {
  OverlayOptions,
  OverlayService,
} from '../services/app/overlay/overlay.service';

@Component({
  template: '',
})
export abstract class OverlayHandlerWithBackButtonHandler extends BackButtonHandler {
  protected readonly overlayRef = inject(OVERLAY_REF, {
    optional: true,
  });

  protected readonly destroyRef = inject(DestroyRef);

  protected readonly overlayService = inject(OverlayService);

  protected constructor() {
    super();
  }

  openOverlay(
    templateRef: TemplateRef<any>,
    options: Omit<OverlayOptions, 'destroyRef'> = {},
  ) {
    return this.overlayService.open(templateRef, {
      destroyRef: this.destroyRef,
      parentOverlayRef: this.overlayRef,
      ...options,
    });
  }

  /** 현재 컴포넌트가 오버레이일 때, 이 컴포넌트 닫는 메서드 */
  close() {
    this.overlayRef?.close();
  }
}
