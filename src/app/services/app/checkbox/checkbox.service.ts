import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** A service that manages state of checkbox */
@Injectable()
export class CheckboxService {
  /** Checked status */
  checked$ = new BehaviorSubject(false);

  /** Focused status */
  focused$ = new BehaviorSubject(false);

  /** Disabled status */
  disabled$ = new BehaviorSubject(false);

  /** Get checked status */
  get checked(): boolean {
    return this.checked$.value;
  }

  /** Set checked status */
  set checked(value: boolean) {
    this.checked$.next(value);
  }

  /** Get selected focused */
  get focused(): boolean {
    return this.focused$.value;
  }

  /** Set selected focused */
  set focused(focused: boolean) {
    this.focused$.next(focused);
  }

  /** Get selected disabled */
  get disabled(): boolean {
    return this.disabled$.value;
  }

  /** Set selected disabled */
  set disabled(disabled: boolean) {
    this.disabled$.next(disabled);
  }
}
