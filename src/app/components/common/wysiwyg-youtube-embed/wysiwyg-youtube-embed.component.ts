import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import { OverlayRef } from '../../../services/app/overlay/overlay.service';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FieldErrorComponent } from '../form-field/field-error/field-error.component';

@Component({
  selector: 'app-wysiwyg-youtube-embed',
  imports: [ReactiveFormsModule, FormFieldComponent, FieldErrorComponent],
  templateUrl: './wysiwyg-youtube-embed.component.html',
  styleUrl: './wysiwyg-youtube-embed.component.scss',
})
export class WysiwygYoutubeEmbedComponent {
  @Output() submitted = new EventEmitter<string>();

  formGroup = new FormGroup({
    url: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.pattern(
          /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([a-zA-Z0-9_-]+)/,
        ),
        Validators.required,
      ],
    }),
  });

  constructor(@Inject(OVERLAY_REF) private readonly overlayRef: OverlayRef) {}

  submitToSave(): void {
    if (this.formGroup.valid) {
      const value = this.formGroup.getRawValue();

      this.submitted.emit(value.url);
    }
  }

  close(): void {
    this.overlayRef.close();
  }
}
