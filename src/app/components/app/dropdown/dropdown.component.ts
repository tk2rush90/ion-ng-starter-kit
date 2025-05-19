import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { OverlayService } from '../../../services/app/overlay/overlay.service';
import { BackdropComponent } from '../../common/backdrop/backdrop.component';
import { BottomSheetComponent } from '../../common/bottom-sheet/bottom-sheet.component';
import { DropdownOptionsComponent } from '../dropdown-options/dropdown-options.component';
import { DropdownOption } from '../../../data/dropdown-options';
import { fadeInOut } from '../../../animations/fade-in-out';
import { slideInOutBottomFull } from '../../../animations/slide-in-out-bottom-full';
import { IconChevronDownComponent } from '../../icons/icon-chevron-down/icon-chevron-down.component';

/** 하단 시트 형태로 옵션을 표시하는 드롭다운 버튼 */
@Component({
  selector: 'app-dropdown',
  imports: [
    BackdropComponent,
    BottomSheetComponent,
    DropdownOptionsComponent,
    IconChevronDownComponent,
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  animations: [fadeInOut(), slideInOutBottomFull()],
})
export class DropdownComponent {
  @Input({ required: true }) options: DropdownOption[] = [];

  @Output() optionChange = new EventEmitter<DropdownOption>();

  @ViewChild('dropdownOptions') dropdownOptionsTemplateRef?: TemplateRef<any>;

  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly overlayService: OverlayService,
  ) {}

  openDropdownOptions(): void {
    if (this.dropdownOptionsTemplateRef) {
      this.overlayService.open(this.dropdownOptionsTemplateRef, {
        destroyRef: this.destroyRef,
      });
    }
  }

  onClickOption(option: DropdownOption): void {
    this.optionChange.emit(option);
  }
}
