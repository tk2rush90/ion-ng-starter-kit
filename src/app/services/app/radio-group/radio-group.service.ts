import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** A service that is provided in each `RadioGroupComponent` to manage state */
@Injectable()
export class RadioGroupService {
  /** Selected value */
  value$ = new BehaviorSubject<any>(undefined);

  /** Focused status */
  focused$ = new BehaviorSubject(false);

  /** Disabled status */
  disabled$ = new BehaviorSubject(false);

  /** Emits with value of option when selected */
  selectOption = new EventEmitter<any>();

  /** Get selected value */
  get value(): any {
    return this.value$.value;
  }

  /** Set selected value */
  set value(value: any) {
    this.value$.next(value);
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
