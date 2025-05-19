import { Pipe, PipeTransform } from '@angular/core';
import { DAY, HOUR, MINUTE, WEEK, YEAR } from '../../constants/milliseconds';

/** A pipe to convert time like `~ minutes ago` */
@Pipe({
  name: 'createdBefore',
  standalone: true,
})
export class CreatedBeforePipe implements PipeTransform {
  /**
   * Transform `value` like `~ minutes ago`.
   * When `value` is `undefined`, it returns `-`.
   * @param value - Date of date string to transform.
   */
  transform(value?: Date | string | undefined): string {
    if (value && value !== '') {
      // Convert value to milliseconds.
      const dateMilliseconds = new Date(value).getTime();

      // Get distance between today and provided date.
      const millisecondsDistance = Date.now() - dateMilliseconds;

      if (millisecondsDistance > YEAR) {
        return `${Math.floor(millisecondsDistance / YEAR)}년 전`;
      } else if (millisecondsDistance > WEEK) {
        return `${Math.floor(millisecondsDistance / WEEK)}주 전`;
      } else if (millisecondsDistance > DAY) {
        return `${Math.floor(millisecondsDistance / DAY)}일 전`;
      } else if (millisecondsDistance > HOUR) {
        return `${Math.floor(millisecondsDistance / HOUR)}시간 전`;
      } else if (millisecondsDistance > MINUTE) {
        return `${Math.floor(millisecondsDistance / MINUTE)}분 전`;
      } else {
        return '방금 전';
      }
    } else {
      // When value is `undefined` or empty string, return empty string.
      return '';
    }
  }
}
