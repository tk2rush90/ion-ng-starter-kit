import { booleanAttribute, Component, Input } from '@angular/core';
import { Icon } from '../../../abstracts/icon';

@Component({
  selector: 'app-icon-heart',
  imports: [],
  templateUrl: './icon-heart.component.html',
  styleUrl: './icon-heart.component.scss',
})
export class IconHeartComponent extends Icon {
  @Input({ transform: booleanAttribute }) fill = false;
}
