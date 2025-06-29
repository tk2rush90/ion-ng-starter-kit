import { Component } from '@angular/core';
import { CardComponent } from '../../../components/common/card/card.component';
import { FormFieldComponent } from '../../../components/common/form-field/form-field.component';
import { AutoResizerDirective } from '../../../components/common/auto-resizer/auto-resizer.directive';

@Component({
  selector: 'app-c-auto-resizer-page',
  imports: [CardComponent, FormFieldComponent, AutoResizerDirective],
  templateUrl: './c-auto-resizer-page.component.html',
  styleUrl: './c-auto-resizer-page.component.scss',
})
export class CAutoResizerPageComponent {}
