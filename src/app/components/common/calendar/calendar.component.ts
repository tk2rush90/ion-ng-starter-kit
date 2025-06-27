import { Component, effect, input, output } from '@angular/core';
import {
  createCalendarDates,
  isDateInRange,
  WEEK_DAYS,
} from '../../../utils/date.utils';
import { DatePipe, formatDate, NgClass } from '@angular/common';
import { OverlayActionsComponent } from '../overlay-actions/overlay-actions.component';
import { IconButtonDirective } from '../icon-button/icon-button.directive';
import {
  CalendarFoldIcon,
  ChevronLeft,
  ChevronRight,
  LucideAngularModule,
} from 'lucide-angular';
import { FlatButtonDirective } from '../flat-button/flat-button.directive';
import { VariableColors } from '../../../utils/tailwind.utils';

@Component({
  selector: 'app-calendar',
  imports: [
    DatePipe,
    NgClass,
    OverlayActionsComponent,
    IconButtonDirective,
    LucideAngularModule,
    FlatButtonDirective,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  host: {
    class: 'flex flex-col items-stretch gap-6',
  },
})
export class CalendarComponent {
  theme = input<VariableColors>('blue');

  /** 반드시 yyyy-MM-dd 포맷 */
  selectedDate = input('');

  /** 선택 가능한 최소 날짜 */
  minDate = input<Date | string | undefined>();

  /** 선택 가능한 최대 날짜 */
  maxDate = input<Date | string | undefined>();

  /** 범위형 날짜 표시할 때 시작일 */
  fromDate = input<Date | string | undefined>();

  /** 범위형 날짜 표시할 때 종료일 */
  toDate = input<Date | string | undefined>();

  /** yyyy-MM-dd 포맷으로 방출 */
  selectedDateChange = output<string>();

  today = new Date();

  displayDate = new Date();

  calendarDates: Date[] = [];

  selectedDateObject: Date | null = null;

  constructor() {
    effect(() => {
      if (this.selectedDate()) {
        this.displayDate = new Date(this.selectedDate());
        this.selectedDateObject = new Date(this.selectedDate());
      }

      this.createDates();
    });
  }

  get displayYear(): number {
    return this.displayDate.getFullYear();
  }

  get displayMonth(): number {
    return this.displayDate.getMonth();
  }

  getDateClasses(calendarDate: Date): any {
    const classes: any = {};

    const theme = this.theme();

    const isSelectedDate = this.isSelectedDate(calendarDate);

    const isFromDate = this.isFromDate(calendarDate);

    const isToDate = this.isToDate(calendarDate);

    const isOutOfDisplayDate = this.isOutOfDisplayDate(calendarDate);

    const isFromOrToDate = isFromDate || isToDate;

    classes['text-white'] = isSelectedDate;
    classes[`bg-${theme}-500`] = isSelectedDate;
    classes['hover:bg-black/5'] = !isFromOrToDate;
    classes['active:bg-black/10'] = !isFromOrToDate;
    classes['dark:hover:bg-white/10'] = !isFromOrToDate;
    classes['dark:active:bg-white/15'] = !isFromOrToDate;
    classes['text-black/15'] = isOutOfDisplayDate;
    classes['dark:text-white/15'] = isOutOfDisplayDate;
    classes[`bg-${theme}-100`] = isFromOrToDate;
    classes[`dark:bg-${theme}-900`] = isFromOrToDate;

    return classes;
  }

  createDates(): void {
    this.calendarDates = createCalendarDates(
      this.displayYear,
      this.displayMonth,
    );
  }

  isSelectedDate(calendarDate: Date): boolean {
    return (
      calendarDate.toDateString() === this.selectedDateObject?.toDateString()
    );
  }

  isOutOfDisplayDate(calendarDate: Date): boolean {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    return this.displayYear !== year || this.displayMonth !== month;
  }

  isToday(calendarDate: Date): boolean {
    return calendarDate.toDateString() === this.today.toDateString();
  }

  isThisMonth(): boolean {
    return (
      this.displayYear === this.today.getFullYear() &&
      this.displayMonth === this.today.getMonth()
    );
  }

  toNextMonth(): void {
    this.displayDate = new Date(this.displayYear, this.displayMonth + 1);
    this.createDates();
  }

  toPreviousMonth(): void {
    this.displayDate = new Date(this.displayYear, this.displayMonth - 1);
    this.createDates();
  }

  toToday(): void {
    this.displayDate = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
    );

    this.createDates();
  }

  isSelectableDate(calendarDate: Date): boolean {
    const minDate = this.minDate();
    const maxDate = this.maxDate();

    const fromDate = this.fromDate();
    const toDate = this.toDate();

    return (
      isDateInRange(calendarDate, minDate, maxDate) ||
      isDateInRange(calendarDate, fromDate, toDate)
    );
  }

  isFromDate(calendarDate: Date): boolean {
    const fromDate = this.fromDate();

    return fromDate
      ? calendarDate.toDateString() === new Date(fromDate).toDateString()
      : false;
  }

  isToDate(calendarDate: Date): boolean {
    const toDate = this.toDate();

    return toDate
      ? calendarDate.toDateString() === new Date(toDate).toDateString()
      : false;
  }

  isRangedDate(calendarDate: Date): boolean {
    const selectedDate = this.selectedDate();
    const fromDate = this.fromDate();
    const toDate = this.toDate();

    if (selectedDate) {
      if (fromDate) {
        return isDateInRange(calendarDate, fromDate, selectedDate);
      } else if (toDate) {
        return isDateInRange(calendarDate, selectedDate, toDate);
      }
    }

    return false;
  }

  selectDate(calendarDate: Date): void {
    if (this.isSelectableDate(calendarDate)) {
      this.selectedDateChange.emit(
        formatDate(calendarDate, 'yyyy-MM-dd', 'en-US'),
      );
    }
  }

  getRangedDateClasses(calendarDate: Date): any {
    const classes: any = {};

    const fromDate = this.fromDate();

    const isFromDate = this.isFromDate(calendarDate);

    const toDate = this.toDate();

    const isToDate = this.isToDate(calendarDate);

    const isSelectedDate = this.isSelectedDate(calendarDate);

    const isRangedDate = this.isRangedDate(calendarDate);

    const widthClass =
      isFromDate || isToDate || isSelectedDate ? 'w-1/2' : 'w-full';

    classes[widthClass] = true;
    classes['right-0'] = !!(isSelectedDate ? toDate && !isToDate : fromDate);
    classes['left-0'] = !!(isSelectedDate ? fromDate && !isFromDate : toDate);
    classes['bg-black/5'] = isRangedDate;
    classes['dark:bg-white/10'] = isRangedDate;

    return classes;
  }

  protected readonly WEEK_DAYS = WEEK_DAYS;
  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;
  protected readonly CalendarFoldIcon = CalendarFoldIcon;
}
