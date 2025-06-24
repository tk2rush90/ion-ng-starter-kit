import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';

/** A directive that makes textarea to be resized by its content */
@Directive({
  selector: 'textarea[appTextareaResizer]',
  standalone: true,
  host: {
    '(window:resize)': `onWindowResize()`,
    '(keydown.enter)': `onEnterKeyDown($event)`,
    '(paste)': `onPasteOrDrop($event)`,
    '(drop)': `onPasteOrDrop($event)`,
    rows: '1',
    class: 'resize-none no-scrollbar',
  },
})
export class TextareaResizerDirective implements AfterViewInit {
  disableLineBreaks = input(false, {
    transform: booleanAttribute,
  });

  private readonly elementRef = inject(ElementRef<HTMLTextAreaElement>);

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
  onWindowResize(): void {
    this.resize();
  }

  onEnterKeyDown(event: Event): void {
    if (this.disableLineBreaks()) {
      event.preventDefault();
    }
  }

  onPasteOrDrop(event: ClipboardEvent | DragEvent): void {
    if (this.disableLineBreaks()) {
      event.preventDefault();

      let clipboardData = '';

      if (event instanceof ClipboardEvent) {
        clipboardData = event.clipboardData?.getData('text/plain') || '';
      } else {
        clipboardData = event.dataTransfer?.getData('text/plain') || '';
      }

      // 모든 줄바꿈 문자(\n 또는 \r)를 공백으로 대체합니다.
      const processedText = clipboardData.replace(/[\n\r]/g, ' ');

      const { value, selectionStart, selectionEnd } =
        this.elementRef.nativeElement;

      // 새 값을 구성합니다: (시작 부분) + (처리된 텍스트) + (끝 부분)
      this.elementRef.nativeElement.value =
        value.substring(0, selectionStart) +
        processedText +
        value.substring(selectionEnd);

      // 커서 위치를 새로 삽입된 텍스트의 끝으로 이동시킵니다.
      const newCursorPosition = selectionStart + processedText.length;

      // 새 선택 범위
      this.elementRef.nativeElement.setSelectionRange(
        newCursorPosition,
        newCursorPosition,
      );

      // 이벤트 발행
      this.elementRef.nativeElement.dispatchEvent(new InputEvent('input'));

      this.resize();
    }
  }

  /** Resize textarea height by content */
  resize(): void {
    this.elementRef.nativeElement.style.height = '0px';
    this.elementRef.nativeElement.style.height = `${this.elementRef.nativeElement.scrollHeight}px`;
  }
}
