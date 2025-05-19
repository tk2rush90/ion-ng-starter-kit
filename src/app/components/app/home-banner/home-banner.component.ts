import { Component, ViewEncapsulation } from '@angular/core';
import { IconCircleHelpComponent } from '../../icons/icon-circle-help/icon-circle-help.component';

@Component({
  selector: 'app-home-banner',
  imports: [IconCircleHelpComponent],
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeBannerComponent {}
