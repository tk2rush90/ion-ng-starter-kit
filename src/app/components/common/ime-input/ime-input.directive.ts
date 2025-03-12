import { Directive, ElementRef, HostListener } from '@angular/core';
import { AppControlValueAccessor } from '../../../abstracts/app-control-value-accessor';
import { Logger } from '../../../utils/logger.utils';

/** A directive to bind value changes immediately for IME input */
@Directive({
  selector: 'input[appImeInput], textarea[appImeInput]',
  standalone: true,
})
export class ImeInputDirective extends AppControlValueAccessor {
  /** Previous value */
  private previousValue = '';

  /** Logger */
  private readonly logger = new Logger('ImeInputDirective');

  constructor(
    private readonly elementRef: ElementRef<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) {
    super();
  }

  /** This method does nothing */
  override writeValue(obj: any) {
    this.previousValue = obj;
    this.elementRef.nativeElement.value = obj;
  }

  /** Update value immediately after keydown or keyup */
  @HostListener('keydown', ['$event'])
  @HostListener('keyup', ['$event'])
  updateValueImmediately(event: Event): void {
    this.updateValue(
      (event.target as HTMLInputElement | HTMLTextAreaElement).value,
    );
  }

  /**
   * Update value with delay. The IME deletes the last character and re-create it by dispatching
   * input event twice. To prevent updating value twice, it should be updated with delay when
   * input event triggered.
   */
  @HostListener('input', ['$event'])
  updateValueWithDelay(event: Event): void {
    setTimeout(() => {
      const currentValue = (
        event.target as HTMLInputElement | HTMLTextAreaElement
      ).value;

      this.logger.log(`Current value: ${currentValue}`);
      this.logger.log(`Previous value: ${this.previousValue}`);

      if (currentValue !== this.previousValue) {
        this.updateValue(currentValue);
      }
    });
  }

  override updateValue(value: any) {
    super.updateValue(value);

    if (this.elementRef) {
      this.elementRef.nativeElement.value = value;
    }
  }
}
