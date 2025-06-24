import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FieldErrorComponent } from '../form-field/field-error/field-error.component';
import { advancedRequired } from '../../../utils/validator.utils';
import { AutoFocusDirective } from '../auto-focus/auto-focus.directive';
import { ImeInputDirective } from '../ime-input/ime-input.directive';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import { OverlayRef } from '../../../services/app/overlay/overlay.service';
import { SheetActionsComponent } from '../../app/sheet-actions/sheet-actions.component';

@Component({
  selector: 'app-wysiwyg-link-editor',
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    FieldErrorComponent,
    AutoFocusDirective,
    ImeInputDirective,
    SheetActionsComponent,
  ],
  templateUrl: './wysiwyg-link-editor.component.html',
  styleUrl: './wysiwyg-link-editor.component.scss',
})
export class WysiwygLinkEditorComponent implements OnInit {
  @Input() url = '';

  @Output() saved = new EventEmitter<string>();

  formGroup = new FormGroup({
    url: new FormControl('', {
      nonNullable: true,
      validators: [advancedRequired],
    }),
  });

  constructor(@Inject(OVERLAY_REF) private readonly overlayRef: OverlayRef) {}

  ngOnInit() {
    if (this.url) {
      this.formGroup.patchValue({
        url: this.url,
      });
    }
  }

  submitToSave(): void {
    if (this.formGroup.valid) {
      const value = this.formGroup.getRawValue();

      this.saved.emit(value.url);

      this.close();
    }
  }

  close(): void {
    this.overlayRef.close();
  }
}
