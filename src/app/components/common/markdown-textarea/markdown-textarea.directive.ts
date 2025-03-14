import {
  AfterContentInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';
import { Logger } from '../../../utils/logger.utils';
import { TextareaHistoryService } from '../../../services/app/textarea-history/textarea-history.service';
import { MarkdownTextArea } from '../../../models/markdown-textarea';
import { isMac } from '../../../utils/platform.utils';

/** A directive that creates textarea for Markdown editor */
@Directive({
  selector: '[appMarkdownTextarea]',
  standalone: true,
  providers: [TextareaHistoryService],
  exportAs: 'markdownTextarea',
})
export class MarkdownTextareaDirective implements AfterContentInit {
  /** Emits when images are pasted */
  @Output() pasteImages = new EventEmitter<File[]>();

  /** A model for markdown textarea that contains features for markdown editor */
  markdownTextarea!: MarkdownTextArea;

  /** Logger */
  private readonly logger = new Logger('MarkdownTextareaDirective');

  /** Characters that can be paired */
  private readonly pairingCharacters = ['*', '_', '~'];

  /** Closing characters that can be skipped */
  private readonly closingCharacters = [']', ')', '}'];

  constructor(
    public readonly textareaHistoryService: TextareaHistoryService,
    private readonly elementRef: ElementRef<HTMLTextAreaElement>,
  ) {}

  ngAfterContentInit() {
    this.textareaHistoryService.register(this.elementRef.nativeElement);

    this.markdownTextarea = new MarkdownTextArea(this.elementRef.nativeElement);
  }

  /** Listen `paste` event to paste images */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (event.clipboardData && event.clipboardData.files.length > 0) {
      event.preventDefault();

      const imageFiles: File[] = [];

      // Filter image files.
      for (let i = 0; i < event.clipboardData.files.length; i++) {
        const file = event.clipboardData.files.item(i);

        if (file && file.type.startsWith('image')) {
          imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        this.pasteImages.emit(imageFiles);
      }
    }
  }

  /** Listen `drop` event to paste images */
  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      event.preventDefault();

      const imageFiles: File[] = [];

      // Filter image files.
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        const file = event.dataTransfer.files.item(i);

        if (file && file.type.startsWith('image')) {
          imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        this.pasteImages.emit(imageFiles);
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onHostKeydown(event: KeyboardEvent): void {
    // Get command key by platform.
    const commandKey = isMac() ? event.metaKey : event.ctrlKey;

    this.logger.log(`Key: '${event.key}' is down`);

    if (commandKey && event.key.toLowerCase() === 'b') {
      // Toggle bold.
      event.preventDefault();

      this.markdownTextarea.toggleBold();
    } else if (
      commandKey &&
      event.shiftKey &&
      event.key.toLowerCase() === 'x'
    ) {
      // Toggle strike.
      event.preventDefault();

      this.markdownTextarea.toggleStrike();
    } else if (commandKey && event.key.toLowerCase() === 'i') {
      // Toggle italic.
      event.preventDefault();

      this.markdownTextarea.toggleItalic();
    } else if (commandKey && event.key.toLowerCase() === 'e') {
      // Toggle code.
      event.preventDefault();

      this.markdownTextarea.toggleCode();
    } else if (event.key.toLowerCase() === '[') {
      // Wrap with `[]`.
      event.preventDefault();

      this.markdownTextarea.wrapWithCharacters('[', ']');
    } else if (event.key.toLowerCase() === '(') {
      // Wrap with `()`.
      event.preventDefault();

      this.markdownTextarea.wrapWithCharacters('(', ')');
    } else if (event.key.toLowerCase() === '{') {
      // Wrap with `{}`.
      event.preventDefault();

      this.markdownTextarea.wrapWithCharacters('{', '}');
    } else if (
      this.pairingCharacters.includes(event.key.toLowerCase()) &&
      this.markdownTextarea.isRanged
    ) {
      // Wrap with pairing characters.
      // It only worked when selection is ranged.
      event.preventDefault();

      this.markdownTextarea.wrapWithCharacters(event.key.toLowerCase());
    } else if (event.key.toLowerCase() === '`') {
      // Wrap with `\``.
      // It always works even ranged or not.
      event.preventDefault();

      this.markdownTextarea.wrapWithCharacters(event.key.toLowerCase());
    } else if (this.closingCharacters.includes(event.key.toLowerCase())) {
      // Skip closing character.
      this.skipNextCharacter(event, event.key.toLowerCase());
    } else if (event.key.toLowerCase() === 'tab') {
      // Indent or outdent.
      event.preventDefault();

      if (event.shiftKey) {
        // Outdent.
        this.markdownTextarea.outdent();
      } else if (this.markdownTextarea.isRanged) {
        // Indent.
        this.markdownTextarea.indent();
      } else {
        // Insert tab.
        this.markdownTextarea.insertCharacters('    ');
      }
    } else if (event.key.toLowerCase() === 'enter') {
      if (
        this.markdownTextarea.selectionStartLine.search(
          /^\s*- |^\s*\d+\. |^\s*>+ /,
        ) !== -1
      ) {
        event.preventDefault();

        this.markdownTextarea.insertNewLine();
      }
    } else if (
      commandKey &&
      event.key.toLowerCase() === 'x' &&
      !this.markdownTextarea.isRanged
    ) {
      event.preventDefault();

      this.markdownTextarea.deleteLine();
    }
  }

  /**
   * Skip the next single `character` and update selection position to after the `character`.
   * It only works when selection is collapsed.
   * @param event - KeyboardEvent to prevent default behavior when skipping next character.
   * @param character - Single character to skip input.
   */
  private skipNextCharacter(event: KeyboardEvent, character: string): void {
    // Get host element.
    const textarea = this.elementRef.nativeElement;

    // Get collapsed status.
    const isCollapsed = textarea.selectionStart === textarea.selectionEnd;

    if (isCollapsed) {
      // Skip `character`.
      const nextCharacter = textarea.value.substring(
        textarea.selectionEnd,
        textarea.selectionEnd + 1,
      );

      if (nextCharacter === character) {
        event.preventDefault();

        textarea.selectionStart = textarea.selectionStart + 1;
        textarea.selectionEnd = textarea.selectionEnd + 1;
      }
    }
  }
}
