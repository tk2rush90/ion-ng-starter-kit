import {
  AfterViewInit,
  booleanAttribute,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  Renderer2,
  ViewEncapsulation,
  DOCUMENT
} from '@angular/core';
import { IconXMarkComponent } from '../../icons/icon-x-mark/icon-x-mark.component';
import { IconAsteriskComponent } from '../../icons/icon-asterisk/icon-asterisk.component';
import { IconChevronDownComponent } from '../../icons/icon-chevron-down/icon-chevron-down.component';

import { AngularPlatform } from '../../../utils/platform.utils';

/** A component to create form field */
@Component({
  selector: 'app-form-field',
  imports: [
    IconXMarkComponent,
    IconAsteriskComponent,
    IconChevronDownComponent,
  ],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  host: {
    class: 'flex-col-start',
  },
  encapsulation: ViewEncapsulation.None,
})
export class FormFieldComponent implements AfterViewInit {
  @Input({ transform: booleanAttribute }) required = false;

  /** Focused status of control element */
  @HostBinding('class.focused') focused = false;

  /** Disabled status of control element */
  @HostBinding('class.disabled') disabled = false;

  isPickerOpened = false;

  /** 현재 요소에 mousedown이 실행됐는지 감지하기 위함. mouseup이 실행되거나 마우스가 현재 요소를 벗어나면 `false` 처리 */
  isMouseDown = false;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  ngAfterViewInit() {
    if (AngularPlatform.isBrowser) {
      const select = this.elementRef.nativeElement.querySelector('select');

      if (select) {
        this.renderer.listen(select, 'keydown.enter', () => {
          this.isPickerOpened = !this.isPickerOpened;
        });

        // select 요소에서 blur 이벤트가 실행돼도 현재 요소에서 mousedown 이벤트가 감지된 상태면 `isPickerOpened` 상태를 변경하지 않음
        this.renderer.listen(select, 'blur', () => {
          if (!this.isMouseDown) {
            this.isPickerOpened = false;
          }
        });
      }
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: Event): void {
    this.isMouseDown = true;

    const target = event.target;

    if (target instanceof HTMLSelectElement) {
      this.isPickerOpened = !this.isPickerOpened;

      event.stopPropagation();
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: Event): void {
    this.isMouseDown = false;

    // select 요소를 직접 클릭할 경우 별도의 `showPicker()` 처리가 필요 없음
    if (event.target instanceof HTMLSelectElement) {
      return;
    }

    const select = this.elementRef.nativeElement.querySelector('select');

    // 그 외의 경우, `isPickerOpened` 상태에 따라 옵션 열고 닫기
    if (select) {
      if (this.isPickerOpened) {
        event.preventDefault();

        this.isPickerOpened = false;
      } else {
        select?.focus(); // blur 이벤트의 실행을 감지하고, control-container에 스타일 적용하기 위해 포커스
        select?.showPicker();

        this.isPickerOpened = true;
      }
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isMouseDown = false;

    const select = this.elementRef.nativeElement.querySelector('select');

    // 옵션이 열려있을 때 select 영역 밖에서 mousedown을 실행하면 blur 이벤트가 감지돼도 `isPickerOpened` 상태가 유지됨
    // 그 상태에서 mouseleave를 실행하면 `isPickerOpened`는 계속 `true`로 유지되기 때문에, mouseleave가 발생했을 때
    // select 요소에 포커스가 있지 않다면 `isPickerOpened` 해제
    if (this.document.activeElement !== select) {
      this.isPickerOpened = false;
    }
  }

  @HostListener('click', ['$event'])
  onClick(): void {
    this.elementRef.nativeElement
      .querySelector<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >('input,textarea')
      ?.focus();
  }
}
