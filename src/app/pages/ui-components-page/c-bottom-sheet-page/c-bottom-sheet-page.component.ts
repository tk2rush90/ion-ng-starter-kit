import {
  Component,
  DestroyRef,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CardComponent } from '../../../components/common/card/card.component';
import { ButtonDirective } from '../../../components/common/button/button.directive';
import { BackdropComponent } from '../../../components/common/backdrop/backdrop.component';
import { BottomSheetComponent } from '../../../components/common/bottom-sheet/bottom-sheet.component';
import { BottomActionsComponent } from '../../../components/common/bottom-actions/bottom-actions.component';
import {
  OverlayRef,
  OverlayService,
} from '../../../services/app/overlay/overlay.service';
import { fadeInOut } from '../../../animations/fade-in-out';
import { slideInOutBottomFull } from '../../../animations/slide-in-out-bottom-full';
import { FormFieldComponent } from '../../../components/common/form-field/form-field.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-c-bottom-sheet-page',
  imports: [
    CardComponent,
    ButtonDirective,
    BackdropComponent,
    BottomSheetComponent,
    BottomActionsComponent,
    FormFieldComponent,
    NgClass,
  ],
  templateUrl: './c-bottom-sheet-page.component.html',
  styleUrl: './c-bottom-sheet-page.component.scss',
  animations: [fadeInOut(), slideInOutBottomFull()],
})
export class CBottomSheetPageComponent {
  bottomSheetTemplateRef = viewChild<TemplateRef<any>>('bottomSheet');

  bottomSheetOverlayRef?: OverlayRef;

  bottomSheetComplexTemplateRef =
    viewChild<TemplateRef<any>>('bottomSheetComplex');

  bottomSheetComplexOverlayRef?: OverlayRef;

  private readonly destroyRef = inject(DestroyRef);

  private readonly overlayService = inject(OverlayService);

  openBottomSheet({
    modalTitle,
    displayCloseButton,
  }: { modalTitle?: string; displayCloseButton?: boolean } = {}): void {
    const bottomSheetTemplateRef = this.bottomSheetTemplateRef();

    if (bottomSheetTemplateRef) {
      this.bottomSheetOverlayRef = this.overlayService.open(
        bottomSheetTemplateRef,
        {
          destroyRef: this.destroyRef,
          onDestroy: () => delete this.bottomSheetOverlayRef,
          context: {
            modalTitle,
            displayCloseButton,
          },
        },
      );
    }
  }

  openBottomSheetComplex(): void {
    const bottomSheetComplexTemplateRef = this.bottomSheetComplexTemplateRef();

    if (bottomSheetComplexTemplateRef) {
      this.bottomSheetComplexOverlayRef = this.overlayService.open(
        bottomSheetComplexTemplateRef,
        {
          destroyRef: this.destroyRef,
          onDestroy: () => delete this.bottomSheetComplexOverlayRef,
        },
      );
    }
  }

  closeBottomSheet(): void {
    this.bottomSheetOverlayRef?.close();
  }

  closeBottomSheetComplex(): void {
    this.bottomSheetOverlayRef?.close();
  }
}
