import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MarkdownTextareaDirective } from '../markdown-textarea/markdown-textarea.directive';
import { IconFormatH1Component } from '../../icons/icon-format-h1/icon-format-h1.component';
import { IconFormatH2Component } from '../../icons/icon-format-h2/icon-format-h2.component';
import { IconFormatH3Component } from '../../icons/icon-format-h3/icon-format-h3.component';
import { IconFormatListBulletedComponent } from '../../icons/icon-format-list-bulleted/icon-format-list-bulleted.component';
import { IconFormatListNumberedComponent } from '../../icons/icon-format-list-numbered/icon-format-list-numbered.component';
import { IconFormatQuoteComponent } from '../../icons/icon-format-quote/icon-format-quote.component';
import { MarkdownEditorViewType } from '../../../types/markdown-editor-view-type';
import { TextareaResizerDirective } from '../textarea-resizer/textarea-resizer.directive';
import { MarkdownService } from '../../../services/app/markdown/markdown.service';
import { SafeHtml } from '@angular/platform-browser';
import { NgTemplateOutlet } from '@angular/common';
import { IconPhotoComponent } from '../../icons/icon-photo/icon-photo.component';
import { FileUploaderDirective } from '../file-uploader/file-uploader.directive';
import { Logger } from '../../../utils/logger.utils';
import { SelectionChangeDetectorDirective } from '../selection-change-detector/selection-change-detector.directive';
import { IconLinkComponent } from '../../icons/icon-link/icon-link.component';
import { IconFormatBoldComponent } from '../../icons/icon-format-bold/icon-format-bold.component';
import { IconFormatItalicComponent } from '../../icons/icon-format-italic/icon-format-italic.component';
import { IconFormatStrikethroughComponent } from '../../icons/icon-format-strikethrough/icon-format-strikethrough.component';
import { IconQuestionMarkCircleComponent } from '../../icons/icon-question-mark-circle/icon-question-mark-circle.component';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { ModalComponent } from '../modal/modal.component';
import {
  OverlayRef,
  OverlayService,
} from '../../../services/app/overlay/overlay.service';
import { IconXMarkComponent } from '../../icons/icon-x-mark/icon-x-mark.component';
import { IconSyncComponent } from '../../icons/icon-sync/icon-sync.component';
import { IconSyncDisabledComponent } from '../../icons/icon-sync-disabled/icon-sync-disabled.component';
import { ToastService } from '../../../services/app/toast/toast.service';

/** Attachment of markdown editor */
export interface MarkdownEditorAttachment {
  /** Actual file blob */
  file: File;

  /** Object url of file displaying in editor */
  objectUrl: string;
}

/** An editor to write markdown */
@Component({
  selector: 'app-markdown-editor',
  imports: [
    MarkdownTextareaDirective,
    IconFormatH1Component,
    IconFormatH2Component,
    IconFormatH3Component,
    IconFormatListBulletedComponent,
    IconFormatListNumberedComponent,
    IconFormatQuoteComponent,
    TextareaResizerDirective,
    NgTemplateOutlet,
    IconPhotoComponent,
    FileUploaderDirective,
    SelectionChangeDetectorDirective,
    IconLinkComponent,
    IconFormatBoldComponent,
    IconFormatItalicComponent,
    IconFormatStrikethroughComponent,
    IconQuestionMarkCircleComponent,
    BackdropComponent,
    ModalComponent,
    IconXMarkComponent,
    IconSyncComponent,
    IconSyncDisabledComponent,
  ],
  templateUrl: './markdown-editor.component.html',
  styleUrl: './markdown-editor.component.scss',
  host: {
    class: 'flex-col-stretch gap-2',
  },
})
export class MarkdownEditorComponent implements OnInit {
  /** Set default view type. Changing this value after rendered doesn't affect anything */
  @Input() defaultViewType?: MarkdownEditorViewType;

  /** Emits when file has attached */
  @Output() fileAttached = new EventEmitter<MarkdownEditorAttachment>();

  /** Emits when `input` event triggered from the textarea */
  @Output() editorInput = new EventEmitter<InputEvent>();

  /** Emits when `keydown` event triggered from the textarea */
  @Output() editorKeydown = new EventEmitter<KeyboardEvent>();

  /** Emits when `keyup` event triggered from the textarea */
  @Output() editorKeyup = new EventEmitter<KeyboardEvent>();

  /** Markdown textarea */
  @ViewChild(MarkdownTextareaDirective)
  markdownTextareaDirective?: MarkdownTextareaDirective;

  /** ElementRef of markdown textarea */
  @ViewChild(MarkdownTextareaDirective, {
    read: ElementRef<HTMLTextAreaElement>,
  })
  markdownTextareaElementRef?: ElementRef<HTMLTextAreaElement>;

  /** ElementRef of preview container */
  @ViewChild('previewContainer', { read: ElementRef<HTMLElement> })
  previewContainerElementRef?: ElementRef<HTMLElement>;

  /** TemplateRef of guide modal */
  @ViewChild('guide', { read: TemplateRef })
  guideTemplateRef?: TemplateRef<any>;

  /** OverlayRef of guide modal */
  guideOverlayRef?: OverlayRef;

  /** View type of markdown editor */
  viewType: MarkdownEditorViewType = 'mirror';

  /** Raw content */
  content = '';

  /** Scroll synced status for mirror view */
  scrollSynced = true;

  exampleHeading1 = this.markdownService.render('# 제목1');
  exampleHeading2 = this.markdownService.render('## 제목2');
  exampleHeading3 = this.markdownService.render('### 제목3');
  exampleHeading4 = this.markdownService.render('#### 제목4');
  exampleHeading5 = this.markdownService.render('##### 제목5');
  exampleHeading6 = this.markdownService.render('###### 제목6');
  exampleBold = this.markdownService.render('**굵게**');
  exampleItalic = this.markdownService.render('_기울기_');
  exampleStrike = this.markdownService.render('~~취소선~~');
  exampleInlineCode = this.markdownService.render('`code`');
  exampleOrderedList = this.markdownService.render(
    '1. 첫 번째\n1. 두 번째\n1. 세 번째',
  );
  exampleUnorderedList = this.markdownService.render(
    '- 첫 번째\n- 두 번째\n- 세 번째',
  );
  exampleQuote = this.markdownService.render(
    '> 일찍 일어나는 새가\n> 벌레를 잡는다',
  );
  exampleImage = this.markdownService.render(
    '![대체 텍스트](https://picsum.photos/id/1/50/50)',
  );
  exampleLink = this.markdownService.render(
    '[링크 텍스트](https://google.com)',
  );

  /** Logger */
  private readonly logger = new Logger('MarkdownEditorComponent');

  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly toastService: ToastService,
    private readonly overlayService: OverlayService,
    private readonly markdownService: MarkdownService,
  ) {}

  /** Get content as rendered */
  get renderedContent(): SafeHtml {
    return this.markdownService.render(this.content);
  }

  ngOnInit() {
    if (this.defaultViewType) {
      this.viewType = this.defaultViewType;
    }
  }

  /**
   * Insert a heading.
   * @param level - Heading level from 1 to 6.
   */
  insertHeading(level: number): void {
    this.markdownTextareaDirective?.markdownTextarea.insertHeading(level);
    this.markdownTextareaDirective?.textareaHistoryService.captureState();
  }

  /** Toggle bold */
  toggleBold(): void {
    this.markdownTextareaDirective?.markdownTextarea.toggleBold();
    this.markdownTextareaDirective?.textareaHistoryService.captureState();
  }

  /** Toggle italic */
  toggleItalic(): void {
    this.markdownTextareaDirective?.markdownTextarea.toggleItalic();
    this.markdownTextareaDirective?.textareaHistoryService.captureState();
  }

  /** Toggle strike */
  toggleStrike(): void {
    this.markdownTextareaDirective?.markdownTextarea.toggleStrike();
    this.markdownTextareaDirective?.textareaHistoryService.captureState();
  }

  /**
   * Insert list block by type.
   * @param type - List type to insert.
   */
  insertList(type: 'ordered' | 'unordered'): void {
    this.markdownTextareaDirective?.markdownTextarea.insertList(type);
    this.markdownTextareaDirective?.textareaHistoryService.captureState();
  }

  /** Toggle quote block */
  toggleQuote(): void {
    this.markdownTextareaDirective?.markdownTextarea.toggleQuote();
    this.markdownTextareaDirective?.textareaHistoryService.captureState();
  }

  /** Insert a link */
  insertLink(): void {
    this.markdownTextareaDirective?.markdownTextarea.insertLink();
    this.markdownTextareaDirective?.textareaHistoryService.captureState();
  }

  /** Toggle scroll synced status */
  toggleScrollSync(): void {
    this.scrollSynced = !this.scrollSynced;

    if (this.scrollSynced) {
      this.toastService.open('스크롤이 동기화 되었습니다');
      this.syncScrollPosition();
    } else {
      this.toastService.open('스크롤 동기화가 해제 되었습니다');
    }
  }

  /** Open a guide */
  openGuide(): void {
    this.guideOverlayRef = this.overlayService.open(this.guideTemplateRef!, {
      destroyRef: this.destroyRef,
    });
  }

  /**
   * Change the view type of editor.
   * @param type - View type.
   */
  changeViewType(type: MarkdownEditorViewType): void {
    this.viewType = type;
  }

  /**
   * Update content.
   * @param event - Event.
   */
  updateContent(event: Event): void {
    this.content = (event.target as HTMLTextAreaElement).value;
  }

  /**
   * Handle uploaded files.
   * @param files - Uploaded files.
   */
  onFileUploaded(files: File[]): void {
    files.forEach((_file) => {
      // Create object url.
      const objectUrl = URL.createObjectURL(_file);

      this.markdownTextareaDirective?.markdownTextarea.insertImage(objectUrl);
      this.markdownTextareaDirective?.textareaHistoryService.captureState();

      // Emit event.
      this.fileAttached.emit({
        file: _file,
        objectUrl,
      });
    });
  }

  /** Handle when invalid file type included */
  onInvalidFileType(): void {
    throw new Error('invalidFileType not implemented');
  }

  /** Sync scroll position between editor and preview */
  syncScrollPosition(): void {
    if (
      this.markdownTextareaElementRef &&
      this.previewContainerElementRef &&
      this.scrollSynced
    ) {
      const availableTotalScrollTopOfPreviewContainer =
        this.previewContainerElementRef.nativeElement.scrollHeight -
        this.previewContainerElementRef.nativeElement.offsetHeight;

      const availableTotalScrollTopOfMarkdownTextarea =
        this.markdownTextareaElementRef.nativeElement.scrollHeight -
        this.markdownTextareaElementRef.nativeElement.offsetHeight;

      const scrolledTopInRatio =
        this.markdownTextareaElementRef.nativeElement.scrollTop /
        availableTotalScrollTopOfMarkdownTextarea;

      this.logger.log(
        'availableTotalScrollTopOfPreviewContainer: ' +
          availableTotalScrollTopOfPreviewContainer,
      );
      this.logger.log(
        'availableTotalScrollTopOfMarkdownTextarea: ' +
          availableTotalScrollTopOfMarkdownTextarea,
      );
      this.logger.log('scrolledTopInRatio: ' + scrolledTopInRatio);

      this.previewContainerElementRef.nativeElement.scrollTo({
        left: 0,
        top: availableTotalScrollTopOfPreviewContainer * scrolledTopInRatio,
      });
    }
  }
}
