import { Component } from '@angular/core';

/** An error to display in `app-form-field` */
@Component({
  selector: 'app-field-error',
  imports: [],
  templateUrl: './field-error.component.html',
  styleUrl: './field-error.component.scss',
  host: {
    class: 'block text-sm text-error-500',
  },
})
export class FieldErrorComponent {}
