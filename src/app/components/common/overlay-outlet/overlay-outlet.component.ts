import { Component, inject, viewChild, ViewContainerRef } from '@angular/core';
import { OverlayService } from '../../../services/app/overlay/overlay.service';

/** Outlet to render overlays */
@Component({
  selector: 'app-overlay-outlet',
  imports: [],
  templateUrl: './overlay-outlet.component.html',
  styleUrl: './overlay-outlet.component.scss',
  host: {
    '(window:keydown.escape)': `onWindowEscapeKeydown()`,
    class:
      'block fixed z-[9999] top-0 bottom-0 left-0 right-0 pointer-events-none',
  },
})
export class OverlayOutletComponent {
  /** `ViewContainerRef` to render overlays */
  viewContainerRef = viewChild('container', { read: ViewContainerRef });

  private readonly overlayService = inject(OverlayService);

  /** When `escape` keydown, close latest overlay */
  onWindowEscapeKeydown(): void {
    this.overlayService.closeLatest();
  }
}
