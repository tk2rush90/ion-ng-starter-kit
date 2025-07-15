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

@Component({
  selector: 'app-c-bottom-sheet-page',
  imports: [
    CardComponent,
    ButtonDirective,
    BackdropComponent,
    BottomSheetComponent,
    BottomActionsComponent,
  ],
  templateUrl: './c-bottom-sheet-page.component.html',
  styleUrl: './c-bottom-sheet-page.component.scss',
  animations: [fadeInOut(), slideInOutBottomFull()],
})
export class CBottomSheetPageComponent {
  bottomSheetTemplateRef = viewChild<TemplateRef<any>>('bottomSheet');

  bottomSheetOverlayRef?: OverlayRef;

  private readonly destroyRef = inject(DestroyRef);

  private readonly overlayService = inject(OverlayService);

  openBottomSheet(): void {
    const bottomSheetTemplateRef = this.bottomSheetTemplateRef();

    if (bottomSheetTemplateRef) {
      this.bottomSheetOverlayRef = this.overlayService.open(
        bottomSheetTemplateRef,
        {
          destroyRef: this.destroyRef,
          onDestroy: () => delete this.bottomSheetOverlayRef,
        },
      );
    }
  }

  closeBottomSheet(): void {
    this.bottomSheetOverlayRef?.close();
  }
}
