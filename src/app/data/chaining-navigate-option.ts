import { NavigationExtras } from '@angular/router';

export interface ChainingNavigateOption {
  /** `string` 이 제공될 경우 `navigateByUrl()` 을, `string[]` 이 제공될 경우 `navigate()` 를 사용 */
  navigateTo: string | string[];

  extra?: NavigationExtras;
}
