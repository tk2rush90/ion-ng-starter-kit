import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

/** An event that contains changed selection position for textarea and input elements */
export interface SelectionChangeEvent {
  /** Changed selection start */
  selectionStart: number | null;

  /** Changed selection end */
  selectionEnd: number | null;
}

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
  @Output() selectionChange = new EventEmitter<SelectionChangeEvent>();

  constructor(
    private readonly elementRef: ElementRef<
      HTMLTextAreaElement | HTMLInputElement
    >,
  ) {}

  emitSelectionChange(): void {
    this.selectionChange.emit({
      selectionStart: this.elementRef.nativeElement.selectionStart,
      selectionEnd: this.elementRef.nativeElement.selectionEnd,
    });
  }
}
