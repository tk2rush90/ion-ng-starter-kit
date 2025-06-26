import { Directive, ElementRef, inject, output } from '@angular/core';
import { SelectionChangeEvent } from '../../../data/selection-change.event';

/** A directive to detect selection change from the textarea or input element */
@Directive({
  selector:
    'textarea[appSelectionChangeDetector],input[appSelectionChangeDetector]',
  standalone: true,
  host: {
    '(keydown)': 'emitSelectionChange()',
    '(keyup)': 'emitSelectionChange()',
    '(input)': 'emitSelectionChange()',
    '(select)': 'emitSelectionChange()',
    '(focus)': 'emitSelectionChange()',
    '(blur)': 'emitSelectionChange()',
  },
})
export class SelectionChangeDetectorDirective {
  selectionChange = output<SelectionChangeEvent>();

  private readonly elementRef: ElementRef<
    HTMLTextAreaElement | HTMLInputElement
  > = inject(ElementRef<HTMLTextAreaElement | HTMLInputElement>);

  emitSelectionChange(): void {
    this.selectionChange.emit({
      selectionStart: this.elementRef.nativeElement.selectionStart,
      selectionEnd: this.elementRef.nativeElement.selectionEnd,
    });
  }
}
