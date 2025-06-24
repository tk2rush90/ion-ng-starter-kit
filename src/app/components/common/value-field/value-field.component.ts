import { booleanAttribute, Component, Input } from '@angular/core';
import { IconAsteriskComponent } from '../../icons/icon-asterisk/icon-asterisk.component';

@Component({
  selector: 'app-value-field',
  imports: [IconAsteriskComponent],
  templateUrl: './value-field.component.html',
  styleUrl: './value-field.component.scss',
})
export class ValueFieldComponent {
  @Input({ transform: booleanAttribute }) required = false;
}
