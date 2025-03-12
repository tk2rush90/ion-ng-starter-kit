import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { overlayGuard } from './overlay.guard';

describe('overlayGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => overlayGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
