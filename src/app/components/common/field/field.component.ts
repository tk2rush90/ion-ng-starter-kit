import { booleanAttribute, Component, input } from '@angular/core';
import { AsteriskIcon, LucideAngularModule } from 'lucide-angular';

/** input, textarea, select 외의 요소를 처리하기 위한 필드 컴포넌트 */
@Component({
  selector: 'app-field',
  imports: [LucideAngularModule],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss',
  host: {
    class: 'flex flex-col items-stretch gap-0.5',
  },
})
export class FieldComponent {
  required = input(false, {
    transform: booleanAttribute,
  });
  protected readonly AsteriskIcon = AsteriskIcon;
}
