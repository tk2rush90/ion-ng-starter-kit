import { CanDeactivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { OverlayService } from '../../services/app/overlay/overlay.service';

export const overlayGuard: CanDeactivateFn<unknown> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
  const router = inject(Router);

  const overlayService = inject(OverlayService);

  if (overlayService.hasOpenedOverlay) {
    overlayService.closeLatest();

    router.navigateByUrl(currentState.url);

    return false;
  } else {
    return true;
  }
};
