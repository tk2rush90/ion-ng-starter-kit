import { Component } from '@angular/core';

/** A hint to display in `app-form-field` */
@Component({
  selector: 'app-field-hint',
  imports: [],
  templateUrl: './field-hint.component.html',
  styleUrl: './field-hint.component.scss',
  host: {
    class: 'block text-sm text-black/50 dark:text-dark-text/50',
  },
})
export class FieldHintComponent {}
