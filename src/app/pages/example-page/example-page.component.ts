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
  ],
  templateUrl: './example-page.component.html',
  styleUrl: './example-page.component.scss',
  animations: [fadeInOut(), slideInOutBottomFull()],
  host: {
    class:
      'flex min-h-dvh flex-col items-stretch gap-4 grow shrink-0 h-auto basis-auto',
  },
})
export class ExamplePageComponent {
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
