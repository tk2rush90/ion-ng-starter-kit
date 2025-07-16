import { Component } from '@angular/core';
import { ColorWeight, VariableColors } from '../../../utils/tailwind.utils';
import { CardComponent } from '../../../components/common/card/card.component';
import { ButtonDirective } from '../../../components/common/button/button.directive';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-c-button-page',
  imports: [CardComponent, ButtonDirective, TitleCasePipe],
  templateUrl: './c-button-page.component.html',
  styleUrl: './c-button-page.component.scss',
})
export class CButtonPageComponent {
  themes: (VariableColors | 'white')[] = [
    'white',
    'slate',
    'gray',
    'zinc',
    'neutral',
    'stone',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
  ];

  weights: ColorWeight[] = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    '950',
  ];

  withOutWhite = this.themes.filter((theme) => theme !== 'white');
}
