import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  numberAttribute,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * 텍스트 입력에 따라 화면 중앙에 커서가 위치하게 하는 Directive
 * 기본값으로 Scroll 은 커서의 Bottom 위치로 향하게 되어있으며, `scrollAdjustment` 속성을 이용해
 * 필요한 만큼 높이 조정 가능
 */
@Directive({
  selector: 'textarea[appTextareaLens]',
  standalone: true,
})
export class TextareaLensDirective {
  @Input({ transform: numberAttribute }) scrollAdjustment = 0;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly elementRef: ElementRef<HTMLTextAreaElement>,
  ) {}

  @HostListener('input')
  focusToCursor(): void {
    const textarea = this.elementRef.nativeElement;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);
    const pseudoElement = this.document.createElement('div');

    pseudoElement.style.cssText = window.getComputedStyle(
      textarea,
      null,
    ).cssText;
    pseudoElement.style.height = 'auto';
    pseudoElement.style.width = textarea.offsetWidth + 'px';
    pseudoElement.style.whiteSpace = 'pre-wrap';
    pseudoElement.style.position = 'fixed';
    pseudoElement.style.visibility = 'hidden';
    pseudoElement.textContent = textBeforeCursor;

    this.document.body.appendChild(pseudoElement);

    const cursorBottom = pseudoElement.offsetHeight;
    const textareaTop = textarea.getBoundingClientRect().top;

    const windowScrollTop = window.scrollY;

    this.document.body.removeChild(pseudoElement);

    const targetScrollTop =
      windowScrollTop + cursorBottom + textareaTop + this.scrollAdjustment;

    window.scrollTo({
      top: targetScrollTop,
      behavior: 'instant',
    });
  }
}
