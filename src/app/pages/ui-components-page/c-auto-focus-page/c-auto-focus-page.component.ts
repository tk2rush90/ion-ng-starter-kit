import { Component } from '@angular/core';
import { CardComponent } from '../../../components/common/card/card.component';
import { AutoFocusDirective } from '../../../components/common/auto-focus/auto-focus.directive';
import { FormFieldComponent } from '../../../components/common/form-field/form-field.component';

@Component({
  selector: 'app-c-auto-focus-page',
  imports: [CardComponent, AutoFocusDirective, FormFieldComponent],
  templateUrl: './c-auto-focus-page.component.html',
  styleUrl: './c-auto-focus-page.component.scss',
})
export class CAutoFocusPageComponent {}
