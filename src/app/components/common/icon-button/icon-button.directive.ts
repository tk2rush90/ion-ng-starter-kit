import { computed, Directive, input } from '@angular/core';
import { VariableColors } from '../../../utils/tailwind.utils';

@Directive({
  selector: '[appIconButton]',
  host: {
    '[class]': `classes()`,
    class: 'flex size-8 items-center justify-center rounded-full',
  },
})
export class IconButtonDirective {
  theme = input<VariableColors | 'transparent'>('transparent');

  classes = computed(() => {
    const theme = this.theme();

    const classes: any = {};

    if (theme === 'transparent') {
      classes['text-current'] = true;
      classes['hover:bg-black/5'] = true;
      classes['active:bg-black/10'] = true;

      classes['dark:hover:bg-white/10'] = true;
      classes['dark:active:bg-white/20'] = true;
    } else {
      classes[`text-${theme}-500`] = true;
      classes[`hover:bg-${theme}-500/5`] = true;
      classes[`active:bg-${theme}-500/10`] = true;
    }

    return classes;
  });
}
