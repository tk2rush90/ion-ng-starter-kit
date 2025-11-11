import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { advancedRequired } from '../../../utils/validator.utils';
import { AutoFocusDirective } from '../auto-focus/auto-focus.directive';
import { ImeInputDirective } from '../ime-input/ime-input.directive';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import { BottomActionsComponent } from '../bottom-actions/bottom-actions.component';
import { VariableColors } from '../../../utils/tailwind.utils';
import { WithBottomActions } from '../../../abstracts/with-bottom-actions';

@Component({
  selector: 'app-wysiwyg-link-editor',
  imports: [
    ReactiveFormsModule,
    AutoFocusDirective,
    ImeInputDirective,
    BottomActionsComponent,
  ],
  templateUrl: './wysiwyg-link-editor.component.html',
  styleUrl: './wysiwyg-link-editor.component.scss',
  host: {
    class: 'flex flex-col items-stretch',
  },
})
export class WysiwygLinkEditorComponent
  extends WithBottomActions
  implements OnInit
{
  theme = input<VariableColors>('blue');

  url = input('');

  saved = output<string>();

  formGroup = new FormGroup({
    url: new FormControl('', {
      nonNullable: true,
      validators: [advancedRequired],
    }),
  });

  private readonly overlayRef = inject(OVERLAY_REF);

  ngOnInit() {
    if (this.url()) {
      this.formGroup.patchValue({
        url: this.url(),
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
