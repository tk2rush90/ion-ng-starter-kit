import { EventEmitter, Injectable, signal } from '@angular/core';

/** A service that is provided in each `RadioGroupComponent` to manage state */
@Injectable()
export class RadioGroupService {
  value = signal<any>(undefined);

  focused = signal(false);

  disabled = signal(false);

  /** Emits with value of option when selected */
  selectOption = new EventEmitter<any>();
}
