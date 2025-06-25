import { InjectionToken } from '@angular/core';
import { OverlayRef } from '../services/app/overlay/overlay.service';

export const OVERLAY_REF = new InjectionToken<OverlayRef>('OVERLAY_REF');
