import { Component, Input, numberAttribute } from '@angular/core';
import { Icon } from '../../../abstracts/icon';

@Component({
  selector: 'app-icon-quote-minus',
  imports: [],
  templateUrl: './icon-quote-minus.component.html',
  styleUrl: './icon-quote-minus.component.scss',
})
export class IconQuoteMinusComponent extends Icon {
  @Input({ transform: numberAttribute }) strokeWidth = 2;
}
