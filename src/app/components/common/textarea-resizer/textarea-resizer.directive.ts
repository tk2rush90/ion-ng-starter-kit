import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

/** A directive that makes textarea to be resized by its content */
@Directive({
  selector: 'textarea[appTextareaResizer]',
  standalone: true,
  host: {
    rows: '1',
    class: 'resize-none no-scrollbar',
  },
})
export class TextareaResizerDirective implements AfterViewInit {
  @Input({ transform: booleanAttribute }) disableLineBreaks = false;

  constructor(private readonly elementRef: ElementRef<HTMLTextAreaElement>) {}

  ngAfterViewInit() {
    // Set initial size after view init.
    this.resize();
  }

  /** Listen `input` event of host element to resize height */
  @HostListener('input')
  onHostInput(): void {
    this.resize();
  }

  /** Listen `resize` event of `window` to resize height */
  @HostListener('window:resize')
  onWindowResize(): void {
    this.resize();
  }

  @HostListener('keydown.enter', ['$event'])
  onEnterKeyDown(event: Event): void {
    if (this.disableLineBreaks) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  @HostListener('drop', ['$event'])
  onPasteOrDrop(event: ClipboardEvent | DragEvent): void {
    if (this.disableLineBreaks) {
      event.preventDefault();

      let clipboardData = '';

      if (event instanceof ClipboardEvent) {
        clipboardData = event.clipboardData?.getData('text/plain') || '';
      } else {
        clipboardData = event.dataTransfer?.getData('text/plain') || '';
      }

      const { value, selectionStart, selectionEnd } =
        this.elementRef.nativeElement;

      this.elementRef.nativeElement.value =
        value.substring(0, selectionStart) +
        // 줄바꿈 모두 제거
        clipboardData.replace(/[\n\r]/gim, ' ') +
        value.substring(selectionEnd);

      this.resize();
    }
  }

  /** Resize textarea height by content */
  resize(): void {
    this.elementRef.nativeElement.style.height = '0px';
    this.elementRef.nativeElement.style.height = `${this.elementRef.nativeElement.scrollHeight}px`;
  }
}
