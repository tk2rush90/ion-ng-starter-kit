import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DropdownOption } from '../../../data/dropdown-options';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import { OverlayRef } from '../../../services/app/overlay/overlay.service';

@Component({
  selector: 'app-dropdown-options',
  imports: [],
  templateUrl: './dropdown-options.component.html',
  styleUrl: './dropdown-options.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DropdownOptionsComponent {
  @Input({ required: true }) options: DropdownOption[] = [];

  @Output() clickOption = new EventEmitter<DropdownOption>();

  constructor(@Inject(OVERLAY_REF) private readonly overlayRef: OverlayRef) {}

  onClickOption(option: DropdownOption): void {
    this.clickOption.emit(option);
    this.close();
  }

  close(): void {
    this.overlayRef.close();
  }
}
