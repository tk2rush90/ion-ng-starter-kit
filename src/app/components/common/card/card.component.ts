import { booleanAttribute, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  host: {
    '[class]': `classes()`,
    class: 'bg-background rounded-3xl',
  },
})
export class CardComponent {
  withBorder = input(false, {
    transform: booleanAttribute,
  });

  withShadow = input(false, {
    transform: booleanAttribute,
  });

  classes = computed(() => {
    const withBorder = this.withBorder();

    const withShadow = this.withShadow();

    return {
      border: withBorder,
      'border-foreground/15': withBorder,
      'shadow-2xl': withShadow,
    };
  });
}
