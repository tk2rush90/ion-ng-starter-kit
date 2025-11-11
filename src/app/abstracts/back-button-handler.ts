import {
  Component,
  effect,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  output,
} from '@angular/core';
import { Platform } from '@ionic/angular/standalone';
import { SubscriptionLike } from 'rxjs';

@Component({
  template: '',
})
export abstract class BackButtonHandler implements OnDestroy {
  clickBack = output();

  priority = input.required({
    transform: numberAttribute,
  });

  protected backButtonSubscription?: SubscriptionLike;

  protected readonly platform = inject(Platform);

  protected constructor() {
    effect(() => {
      const priority = this.priority();

      this.backButtonSubscription?.unsubscribe();

      this.backButtonSubscription =
        this.platform.backButton.subscribeWithPriority(priority, () => {
          this.clickBack.emit();
        });
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription?.unsubscribe();
  }
}
