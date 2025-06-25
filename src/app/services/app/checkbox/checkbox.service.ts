import { Injectable, signal } from '@angular/core';

/** A service that manages state of checkbox */
@Injectable()
export class CheckboxService {
  /** Checked status */
  checked = signal(false);

  /** Focused status */
  focused = signal(false);

  /** Disabled status */
  disabled = signal(false);
}
