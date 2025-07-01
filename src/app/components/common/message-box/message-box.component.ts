import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { VariableColors } from '../../../utils/tailwind.utils';

@Component({
  selector: 'app-message-box',
  imports: [LucideAngularModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.scss',
  host: {
    class: 'flex items-start justify-start gap-1 p-4 rounded-3xl',
    '[class]': `classes()`,
  },
})
export class MessageBoxComponent {
  icon = input.required<LucideIconData>();

  theme = input<VariableColors>('blue');

  classes = computed(() => {
    const theme = this.theme();

    return {
      [`bg-${theme}-500/10`]: true,
      [`text-${theme}-500`]: true,
    };
  });
}
