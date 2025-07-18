import {
  Component,
  DestroyRef,
  inject,
  input,
  isDevMode,
  OnDestroy,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ProseMirrorEditorService } from '../../../services/app/prose-mirror-editor/prose-mirror-editor.service';
import {
  changeList,
  findLinkMark,
  getCurrentSelectionRange,
  indentList,
  insertParagraph,
  isBlockQuoteActive,
  isCodeBlockActive,
  isCursorInList,
  isFirstListItem,
  isHeadingActive,
  isLinkMarkActive,
  isMarkActive,
  isSelectionExpanded,
  outdentList,
  removeLinkMark,
  selectMark,
  setBlockNode,
  setLinkMark,
  toggleInlineMark,
  toggleList,
  unwrapBlockquote,
  warpInBlockNode,
} from '../../../utils/prosemirror.utils';
import { OverlayService } from '../../../services/app/overlay/overlay.service';
import { IconPilcrowPlusComponent } from '../../icons/icon-pilcrow-plus/icon-pilcrow-plus.component';
import { IconQuoteMinusComponent } from '../../icons/icon-quote-minus/icon-quote-minus.component';
import { IconQuotePlusComponent } from '../../icons/icon-quote-plus/icon-quote-plus.component';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { WysiwygLinkEditorComponent } from '../wysiwyg-link-editor/wysiwyg-link-editor.component';
import { fadeInOut } from '../../../animations/fade-in-out';
import { slideInOutBottomFull } from '../../../animations/slide-in-out-bottom-full';
import { slideInBottom } from '../../../animations/slide-in-bottom';
import { fadeIn } from '../../../animations/fade-in';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import {
  BoldIcon,
  BracesIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  IndentDecreaseIcon,
  IndentIncreaseIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  LucideAngularModule,
  PilcrowIcon,
  QuoteIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UnlinkIcon,
} from 'lucide-angular';
import { IconButtonDirective } from '../icon-button/icon-button.directive';
import { NgClass } from '@angular/common';
import { VariableColors } from '../../../utils/tailwind.utils';

@Component({
  selector: 'app-wysiwyg-editor-actions',
  imports: [
    IconPilcrowPlusComponent,
    IconQuoteMinusComponent,
    IconQuotePlusComponent,
    BackdropComponent,
    BottomSheetComponent,
    WysiwygLinkEditorComponent,
    LucideAngularModule,
    IconPilcrowPlusComponent,
    IconQuotePlusComponent,
    IconQuoteMinusComponent,
    IconButtonDirective,
    NgClass,
  ],
  templateUrl: './wysiwyg-editor-actions.component.html',
  styleUrl: './wysiwyg-editor-actions.component.scss',
  animations: [fadeInOut(), slideInOutBottomFull(), slideInBottom(), fadeIn()],
  host: {
    class:
      'flex w-full flex-row flex-nowrap items-center justify-start gap-1 overflow-auto rounded-full bg-foreground/5 dark:bg-foreground/10 px-3 backdrop-blur-lg has-[+_*]:w-auto h-10',
  },
})
export class WysiwygEditorActionsComponent implements OnDestroy {
  theme = input<VariableColors>('blue');

  linkEditorTemplateRef = viewChild<TemplateRef<any>>('linkEditor');

  private linkUpdateTimeout: any;

  private readonly overlayRef = inject(OVERLAY_REF, {
    optional: true,
  });

  private readonly destroyRef = inject(DestroyRef);

  private readonly overlayService = inject(OverlayService);

  private readonly proseMirrorEditorService = inject(ProseMirrorEditorService);

  get hasView(): boolean {
    return !!this.proseMirrorEditorService.view;
  }

  ngOnDestroy() {
    clearTimeout(this.linkUpdateTimeout);
  }

  openLinkEditor(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    const view = this.proseMirrorEditorService.view;

    const linkMark = findLinkMark(view);

    if (linkMark) {
      // 기존 링크가 있을 경우 selection 범위를 확장해서 링크 전체 선택
      // 이후 링크가 변경되면 선택 영역에 대한 링크가 변경될 수 있도록
      selectMark(view, 'link');
    }

    // 오버레이 종료 후 selection 복원 위해 캐시
    const selection = view.state.selection;

    const linkEditorTemplateRef = this.linkEditorTemplateRef();

    if (linkEditorTemplateRef) {
      this.overlayService.open(linkEditorTemplateRef, {
        destroyRef: this.destroyRef,
        parentOverlayRef: this.overlayRef,
        context: {
          url: linkMark?.attrs['href'],
        },
        onDestroy: () => {
          if (selection) {
            const { dom, state, dispatch } = view;

            dom.focus({
              preventScroll: true,
            });

            // 기존 selection 복원
            const tr = state.tr.setSelection(selection);

            dispatch(tr);
          }
        },
      });
    }
  }

  /** EditorState에 node가 정의되어 있는지 확인하는 함수 */
  hasBlockNode(node: string): boolean {
    return !!this.proseMirrorEditorService.state?.schema.nodes[node];
  }

  onLinkSaved(newUrl: string): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    const view = this.proseMirrorEditorService.view;

    // 오버레이 종료 후 포커스 대기
    this.linkUpdateTimeout = setTimeout(() => {
      const { from, to } = getCurrentSelectionRange(view);

      setLinkMark(view, {
        from,
        to,
        href: newUrl,
      });
    });
  }

  removeLink(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    removeLinkMark(this.proseMirrorEditorService.view);
  }

  addParagraph(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    insertParagraph(this.proseMirrorEditorService.view);
  }

  isBoldActive(): boolean {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return false;
    }

    return isMarkActive(this.proseMirrorEditorService.view, 'strong');
  }

  isItalic(): boolean {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return false;
    }

    return isMarkActive(this.proseMirrorEditorService.view, 'em');
  }

  isUnderlineActive(): boolean {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return false;
    }

    return isMarkActive(this.proseMirrorEditorService.view, 'underline');
  }

  isStrike(): boolean {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return false;
    }

    return isMarkActive(this.proseMirrorEditorService.view, 'strike');
  }

  isCode(): boolean {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return false;
    }

    return isMarkActive(this.proseMirrorEditorService.view, 'code');
  }

  isLink(): boolean {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return false;
    }

    return isLinkMarkActive(this.proseMirrorEditorService.view);
  }

  isCursorInCodeBlock() {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return false;
    }

    return isCodeBlockActive(this.proseMirrorEditorService.view);
  }

  isCursorInHeading(targetLevel?: number) {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return false;
    }

    return isHeadingActive(this.proseMirrorEditorService.view, targetLevel);
  }

  isCursorInBlockquote(): boolean {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return false;
    }

    return isBlockQuoteActive(this.proseMirrorEditorService.view);
  }

  isCursorInList(type?: 'ordered_list' | 'bullet_list'): boolean {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return false;
    }

    return isCursorInList(this.proseMirrorEditorService.view, type);
  }

  isExpanded(): boolean {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return false;
    }

    return isSelectionExpanded(this.proseMirrorEditorService.view);
  }

  unwrapBlockquote(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    unwrapBlockquote(this.proseMirrorEditorService.view);
  }

  toggleHeading(level: number): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    setBlockNode(this.proseMirrorEditorService.view, 'heading', {
      level,
    });
  }

  toggleParagraph(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    setBlockNode(this.proseMirrorEditorService.view, 'paragraph');
  }

  insertBlockQuote(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    warpInBlockNode(this.proseMirrorEditorService.view, 'blockquote');
  }

  insertOrderedList(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    if (isCursorInList(this.proseMirrorEditorService.view, 'bullet_list')) {
      changeList(this.proseMirrorEditorService.view, 'ordered_list');
    } else {
      toggleList(this.proseMirrorEditorService.view, 'ordered_list');
    }
  }

  insertBulletList(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    if (isCursorInList(this.proseMirrorEditorService.view, 'ordered_list')) {
      changeList(this.proseMirrorEditorService.view, 'bullet_list');
    } else {
      toggleList(this.proseMirrorEditorService.view, 'bullet_list');
    }
  }

  indentList(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    indentList(this.proseMirrorEditorService.view);
  }

  outdentList(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    outdentList(this.proseMirrorEditorService.view);
  }

  isFirstListItem(): boolean {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return false;
    }

    return isFirstListItem(this.proseMirrorEditorService.view);
  }

  toggleBold(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    toggleInlineMark(this.proseMirrorEditorService.view, 'strong');
  }

  toggleItalic(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    toggleInlineMark(this.proseMirrorEditorService.view, 'em');
  }

  toggleUnderline(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    toggleInlineMark(this.proseMirrorEditorService.view, 'underline');
  }

  toggleLineThrough(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    toggleInlineMark(this.proseMirrorEditorService.view, 'strike');
  }

  setCodeBlock(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    setBlockNode(this.proseMirrorEditorService.view, 'code_block');
  }

  toggleCode(): void {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    toggleInlineMark(this.proseMirrorEditorService.view, 'code');
  }

  getButtonEffectClasses(state: boolean): any {
    const classes: any = {};

    if (!state) {
      classes['after:hidden'] = true;
    }

    return classes;
  }

  protected readonly PilcrowIcon = PilcrowIcon;
  protected readonly Heading1Icon = Heading1Icon;
  protected readonly Heading2Icon = Heading2Icon;
  protected readonly Heading3Icon = Heading3Icon;
  protected readonly BracesIcon = BracesIcon;
  protected readonly QuoteIcon = QuoteIcon;
  protected readonly BoldIcon = BoldIcon;
  protected readonly ItalicIcon = ItalicIcon;
  protected readonly UnderlineIcon = UnderlineIcon;
  protected readonly StrikethroughIcon = StrikethroughIcon;
  protected readonly CodeIcon = CodeIcon;
  protected readonly LinkIcon = LinkIcon;
  protected readonly UnlinkIcon = UnlinkIcon;
  protected readonly ListOrderedIcon = ListOrderedIcon;
  protected readonly ListIcon = ListIcon;
  protected readonly IndentIncreaseIcon = IndentIncreaseIcon;
  protected readonly IndentDecreaseIcon = IndentDecreaseIcon;
}
