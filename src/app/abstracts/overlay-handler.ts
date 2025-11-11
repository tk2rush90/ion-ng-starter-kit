import { Component, DestroyRef, inject, TemplateRef } from '@angular/core';
import {
  OverlayOptions,
  OverlayService,
} from '../services/app/overlay/overlay.service';
import { OVERLAY_REF } from '../tokens/overlay-ref';

@Component({
  template: '',
})
export abstract class OverlayHandler {
  protected readonly overlayRef = inject(OVERLAY_REF, {
    optional: true,
  });

  protected readonly destroyRef = inject(DestroyRef);

  protected readonly overlayService = inject(OverlayService);

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
