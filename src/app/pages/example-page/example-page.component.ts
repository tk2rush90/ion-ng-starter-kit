import { Component, DestroyRef, inject, TemplateRef } from '@angular/core';
import { CheckboxComponent } from '../../components/common/checkbox/checkbox.component';
import { BackdropComponent } from '../../components/common/backdrop/backdrop.component';
import { BottomSheetComponent } from '../../components/common/bottom-sheet/bottom-sheet.component';
import { OverlayService } from '../../services/app/overlay/overlay.service';
import { fadeInOut } from '../../animations/fade-in-out';
import { slideInOutBottomFull } from '../../animations/slide-in-out-bottom-full';
import { FlatButtonDirective } from '../../components/common/flat-button/flat-button.directive';
import { ConfirmComponent } from '../../components/common/confirm/confirm.component';
import { ModalComponent } from '../../components/common/modal/modal.component';
import { FileHandlerDirective } from '../../components/common/file-handler/file-handler.directive';
import { KB, MB } from '../../constants/size';
import { ToastService } from '../../services/app/toast/toast.service';
import { FormFieldComponent } from '../../components/common/form-field/form-field.component';
import { AutoResizerDirective } from '../../components/common/auto-resizer/auto-resizer.directive';
import { FieldHintComponent } from '../../components/common/form-field/field-hint/field-hint.component';
import { FieldErrorComponent } from '../../components/common/form-field/field-error/field-error.component';
import { GoogleOauthButtonComponent } from '../../components/common/google-oauth-button/google-oauth-button.component';
import { RadioGroupComponent } from '../../components/common/radio-group/radio-group.component';
import { RadioComponent } from '../../components/common/radio-group/radio/radio.component';
import { FieldComponent } from '../../components/common/field/field.component';
import { SpinnerComponent } from '../../components/common/spinner/spinner.component';
import { WysiwygEditorComponent } from '../../components/common/wysiwyg-editor/wysiwyg-editor.component';
import { WysiwygEditorActionsComponent } from '../../components/common/wysiwyg-editor-actions/wysiwyg-editor-actions.component';
import { ProseMirrorEditorService } from '../../services/app/prose-mirror-editor/prose-mirror-editor.service';
import {
  createInlineEditorState,
  inlineSchema,
} from '../../utils/prosemirror.utils';

@Component({
  selector: 'app-example-page',
  imports: [
    CheckboxComponent,
    BackdropComponent,
    BottomSheetComponent,
    FlatButtonDirective,
    ConfirmComponent,
    ModalComponent,
    FileHandlerDirective,
    FormFieldComponent,
    AutoResizerDirective,
    FieldHintComponent,
    FieldErrorComponent,
    GoogleOauthButtonComponent,
    RadioGroupComponent,
    RadioComponent,
    FieldComponent,
    SpinnerComponent,
    WysiwygEditorComponent,
    WysiwygEditorActionsComponent,
  ],
  templateUrl: './example-page.component.html',
  styleUrl: './example-page.component.scss',
  animations: [fadeInOut(), slideInOutBottomFull()],
  host: {
    class:
      'flex min-h-dvh flex-col items-stretch gap-4 grow shrink-0 h-auto basis-auto',
  },
  providers: [ProseMirrorEditorService],
})
export class ExamplePageComponent {
  editorState = createInlineEditorState(inlineSchema, {
    placeholder: '어떤 생각을 하고 계신가요?',
  });

  private readonly destroyRef = inject(DestroyRef);

  private readonly overlayService = inject(OverlayService);

  private readonly toastService = inject(ToastService);

  openOverlay(templateRef: TemplateRef<any> | null): void {
    if (templateRef) {
      this.overlayService.open(templateRef, {
        destroyRef: this.destroyRef,
      });
    }
  }

  openToast(message: string): void {
    this.toastService.open({
      message,
    });
  }

  fileOrFilesChange(fileOrFiles: File | File[]): void {
    console.log(fileOrFiles);
  }

  protected readonly MB = MB;
  protected readonly KB = KB;
}
