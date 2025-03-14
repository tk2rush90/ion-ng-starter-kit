import { Injectable, OnDestroy } from '@angular/core';
import { isMac } from '../../../utils/platform.utils';
import { Logger } from '../../../utils/logger.utils';

/** A snapshot data of textarea value for history */
export interface TextareaHistorySnapshot {
  /** Captured value */
  value: string;

  /** Captured selectionStart */
  selectionStart: number;

  /** Captured selectionEnd */
  selectionEnd: number;
}

/** A service that manages history of textarea changes programmatically */
@Injectable()
export class TextareaHistoryService implements OnDestroy {
  /** Textarea element to manage history */
  private textarea!: HTMLTextAreaElement;

  /** Capture timeout timer */
  private captureTimer: any;

  /** Index of current history */
  private historyIndex = -1;

  /** Captured history snapshots */
  private histories: TextareaHistorySnapshot[] = [];

  /** Maximum history snapshot amount */
  private readonly maxHistoriesLength = 300;

  /** Timeout delay to capture history */
  private readonly historyCaptureTimeout = 100;

  /** Logger */
  private readonly logger = new Logger('TextareaHistoryService');

  /** Get total length of histories */
  get historiesLength(): number {
    return this.histories.length;
  }

  /** Get the last index of histories */
  get historiesLastIndex(): number {
    return this.historiesLength - 1;
  }

  ngOnDestroy() {
    this.unregister();
  }

  /**
   * Register a textarea to
   * @param textarea
   */
  register(textarea: HTMLTextAreaElement): void {
    if (this.textarea) {
      this.logger.warn('Textarea is already set to manage histories');
    } else {
      this.textarea = textarea;

      // Capture current state on register.
      this.captureState();

      // Add keydown event listener.
      this.textarea.addEventListener('keydown', this.keydownListener);
    }
  }

  /**
   * Keydown event listener to detect undo and redo commands.
   * @param event - Keyboard event.
   */
  private readonly keydownListener = (event: KeyboardEvent) => {
    const commandKey = isMac() ? event.metaKey : event.ctrlKey;

    if (
      (commandKey && event.key.toLowerCase() === 'y') ||
      (commandKey && event.shiftKey && event.key.toLowerCase() === 'z')
    ) {
      // Redo.
      event.preventDefault();

      this.redo();
    } else if (commandKey && event.key.toLowerCase() === 'z') {
      // Undo.
      event.preventDefault();

      this.undo();
    } else {
      // Capture changes.
      clearTimeout(this.captureTimer);

      this.captureTimer = setTimeout(() => {
        this.captureState();
      }, this.historyCaptureTimeout);
    }
  };

  /** Capture snapshot of current status */
  captureState(): void {
    const currentHistory = this.histories[this.historyIndex];

    // When data not changed, return.
    if (
      currentHistory?.value === this.textarea.value &&
      currentHistory?.selectionStart === this.textarea.selectionStart &&
      currentHistory?.selectionEnd === this.textarea.selectionEnd
    ) {
      this.logger.log('Data not changed. Ignore capture');

      return;
    }

    // Delete after current index.
    this.histories = this.histories.slice(0, this.historyIndex + 1);

    // Push history data.
    this.histories.push({
      value: this.textarea.value,
      selectionStart: this.textarea.selectionStart,
      selectionEnd: this.textarea.selectionEnd,
    });

    // Cut old data.
    if (this.historiesLength > this.maxHistoriesLength) {
      this.histories = this.histories.slice(
        this.historiesLength - this.maxHistoriesLength,
      );
    }

    // Cursor on the last index.
    this.historyIndex = this.historiesLastIndex;

    this.logger.debug(
      'Captured state',
      this.histories[this.historiesLastIndex],
    );

    this.logger.debug('Index after captured', this.historyIndex);
  }

  /** Undo to previous history */
  undo(): void {
    this.logger.log('Undo');

    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.applyHistoryData();

      this.dispatchInputEvent();
    }
  }

  /** Redo to next history */
  redo(): void {
    this.logger.log('Redo');

    if (this.historyIndex < this.historiesLastIndex) {
      this.historyIndex++;
      this.applyHistoryData();

      this.dispatchInputEvent();
    }
  }

  /** Apply history data to textarea by current history index */
  applyHistoryData(): void {
    const historyData = this.histories[this.historyIndex];

    if (historyData) {
      this.textarea.value = historyData.value;
      this.textarea.selectionStart = historyData.selectionStart;
      this.textarea.selectionEnd = historyData.selectionEnd;
    }
  }

  /** Unregister textarea and event listener for keydown */
  unregister(): void {
    this.textarea.removeEventListener('keydown', this.keydownListener);

    // Delete registered textarea.
    this.textarea = undefined as any;
  }

  /** Dispatch input event to trigger `valueChanges` of NgControl */
  dispatchInputEvent(): void {
    this.textarea.dispatchEvent(
      new Event('input', { bubbles: true, cancelable: true }),
    );
  }
}
