import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ChainingNavigateOption } from '../../../data/chaining-navigate-option';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor(private readonly router: Router) {}

  async chainingNavigate(options: ChainingNavigateOption[]): Promise<void> {
    for (const option of options) {
      let routed = false;

      if (option.navigateTo instanceof Array) {
        routed = await this.router.navigate(option.navigateTo, option.extra);
      } else {
        routed = await this.router.navigateByUrl(
          option.navigateTo,
          option.extra,
        );
      }

      if (!routed) {
        break;
      }
    }
  }
}
