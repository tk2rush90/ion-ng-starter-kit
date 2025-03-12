import { Directive } from '@angular/core';

/**
 * An additional content can be displayed in `app-form-field`.
 * It will be added to the start of actions container.
 */
@Directive({
  selector: '[appFormFieldAdditional]',
  standalone: true,
})
export class FormFieldAdditionalDirective {}
