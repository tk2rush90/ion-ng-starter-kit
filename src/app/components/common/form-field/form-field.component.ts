import {
  AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Renderer2,
  signal,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { AngularPlatform } from '../../../utils/platform.utils';
import {
  AsteriskIcon,
  CalendarIcon,
  ChevronDownIcon,
  LucideAngularModule,
  XIcon,
} from 'lucide-angular';
import { VariableColors } from '../../../utils/tailwind.utils';
import { NgClass } from '@angular/common';
import { IconButtonDirective } from '../icon-button/icon-button.directive';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { ModalComponent } from '../modal/modal.component';
import { CalendarOverlayComponent } from '../calendar-overlay/calendar-overlay.component';
import { fadeInOut } from '../../../animations/fade-in-out';
import { slideInOutBottom } from '../../../animations/slide-in-out-bottom';
import {
  OverlayRef,
  OverlayService,
} from '../../../services/app/overlay/overlay.service';

/** A component to create form field */
@Component({
  selector: 'app-form-field',
  imports: [
    LucideAngularModule,
    NgClass,
    IconButtonDirective,
    BackdropComponent,
    ModalComponent,
    CalendarOverlayComponent,
  ],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    '(click)': `onClick()`,
    '(mouseleave)': `onMouseLeave()`,
    '(mouseup)': `onMouseUp($event)`,
    '(mousedown)': `onMouseDown($event)`,
    class: 'flex flex-col items-stretch gap-0.5',
  },
  animations: [fadeInOut(), slideInOutBottom()],
})
export class FormFieldComponent implements AfterViewInit, OnDestroy {
  required = input(false, {
    transform: booleanAttribute,
  });

  theme = input<VariableColors>('blue');

  controlClasses = computed(() => {
    const theme = this.theme();

    const isDisabled = this.isDisabled();

    const classes: any = {};

    if (isDisabled) {
      classes['bg-black/15'] = true;
      classes['bg-black/30'] = true;
    } else {
      classes[`bg-${theme}-100`] = true;
      classes[`has-[:focus]:border-${theme}-500`] = true;
    }

    return classes;
  });

  isPickerOpened = false;

  /** 현재 요소에 mousedown이 실행됐는지 감지하기 위함. mouseup이 실행되거나 마우스가 현재 요소를 벗어나면 `false` 처리 */
  isMouseDown = false;

  isDisabled = signal(false);

  calendarTemplateRef = viewChild<TemplateRef<any>>('calendar');

  calendarOverlayRef?: OverlayRef;

  private calendarCloseTimeout: any;

  private mutationObserver?: MutationObserver;

  private readonly document = inject(DOCUMENT);

  private readonly renderer = inject(Renderer2);

  private readonly elementRef: ElementRef<HTMLElement> = inject(
    ElementRef<HTMLElement>,
  );

  private readonly destroyRef = inject(DestroyRef);

  private readonly overlayService = inject(OverlayService);

  get currentDate(): string {
    return (
      this.elementRef.nativeElement.querySelector<HTMLInputElement>(
        'input[type=date]',
      )?.value || ''
    );
  }

  get minDate(): string {
    return (
      this.elementRef.nativeElement.querySelector<HTMLInputElement>(
        'input[type=date]',
      )?.min || ''
    );
  }

  get maxDate(): string {
    return (
      this.elementRef.nativeElement.querySelector<HTMLInputElement>(
        'input[type=date]',
      )?.max || ''
    );
  }

  get fromDate(): string {
    return (
      this.elementRef.nativeElement.querySelector<HTMLInputElement>(
        'input[type=date]',
      )?.dataset['fromDate'] || ''
    );
  }

  get toDate(): string {
    return (
      this.elementRef.nativeElement.querySelector<HTMLInputElement>(
        'input[type=date]',
      )?.dataset['toDate'] || ''
    );
  }

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

      this.mutationObserver = new MutationObserver((records) => {
        records.forEach((record) => {
          if (
            record.target instanceof HTMLInputElement ||
            record.target instanceof HTMLSelectElement ||
            record.target instanceof HTMLTextAreaElement
          ) {
            this.isDisabled.set(record.target.disabled);
          }
        });
      });

      const control = this.elementRef.nativeElement.querySelector<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >('input,textarea,select');

      if (control) {
        this.mutationObserver.observe(control, {
          attributes: true,
        });
      }
    }
  }

  ngOnDestroy() {
    this.mutationObserver?.disconnect();

    clearTimeout(this.calendarCloseTimeout);
  }

  onMouseDown(event: Event): void {
    this.isMouseDown = true;

    const target = event.target;

    if (target instanceof HTMLSelectElement) {
      this.isPickerOpened = !this.isPickerOpened;

      event.stopPropagation();
    }
  }

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
        select?.focus();
        select?.showPicker();

        this.isPickerOpened = true;
      }
    }
  }

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

  onClick(): void {
    (
      this.elementRef.nativeElement.querySelector('input,textarea,select') as
        | HTMLInputElement
        | HTMLTextAreaElement
    )?.focus();
  }

  resetValue(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    const target = this.elementRef.nativeElement.querySelector<
      HTMLInputElement | HTMLTextAreaElement
    >('input,textarea');

    if (target) {
      target.value = '';
      target.dispatchEvent(new Event('input'));
    }
  }

  openCalendar(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    const calendarTemplateRef = this.calendarTemplateRef();

    if (calendarTemplateRef) {
      this.calendarOverlayRef = this.overlayService.open(calendarTemplateRef, {
        destroyRef: this.destroyRef,
        onDestroy: () => {
          clearTimeout(this.calendarCloseTimeout);

          // 즉시 열림 방지
          this.calendarCloseTimeout = setTimeout(
            () => delete this.calendarOverlayRef,
          );
        },
      });
    }
  }

  onSelectedDateChange(dateString: string): void {
    const target =
      this.elementRef.nativeElement.querySelector<HTMLInputElement>(
        'input[type=date]',
      );

    if (target) {
      target.value = dateString;
      target.dispatchEvent(new Event('input'));
    }

    this.calendarOverlayRef?.close();
  }

  protected readonly AsteriskIcon = AsteriskIcon;
  protected readonly XIcon = XIcon;
  protected readonly ChevronDownIcon = ChevronDownIcon;
  protected readonly CalendarIcon = CalendarIcon;
}
