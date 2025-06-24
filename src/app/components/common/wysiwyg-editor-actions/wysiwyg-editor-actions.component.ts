import {
  Component,
  DestroyRef,
  inject,
  isDevMode,
  OnDestroy,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ProseMirrorEditorService } from '../../../services/app/prose-mirror-editor/prose-mirror-editor.service';
import {
  findLinkMark,
  getCurrentSelectionRange,
  insertParagraph,
  isBlockQuoteActive,
  isCodeBlockActive,
  isHeadingActive,
  isLinkMarkActive,
  isMarkActive,
  isSelectionExpanded,
  removeLinkMark,
  selectMark,
  setBlockNode,
  setLinkMark,
  toggleInlineMark,
  unwrapBlockquote,
  warpInBlockNode,
} from '../../../utils/prosemirror.utils';
import { OverlayService } from '../../../services/app/overlay/overlay.service';
import { IconBoldComponent } from '../../icons/icon-bold/icon-bold.component';
import { IconBracesComponent } from '../../icons/icon-braces/icon-braces.component';
import { IconCodeComponent } from '../../icons/icon-code/icon-code.component';
import { IconHeading1Component } from '../../icons/icon-heading-1/icon-heading-1.component';
import { IconHeading2Component } from '../../icons/icon-heading-2/icon-heading-2.component';
import { IconHeading3Component } from '../../icons/icon-heading-3/icon-heading-3.component';
import { IconItalicComponent } from '../../icons/icon-italic/icon-italic.component';
import { IconLinkComponent } from '../../icons/icon-link/icon-link.component';
import { IconPilcrowComponent } from '../../icons/icon-pilcrow/icon-pilcrow.component';
import { IconPilcrowPlusComponent } from '../../icons/icon-pilcrow-plus/icon-pilcrow-plus.component';
import { IconQuoteComponent } from '../../icons/icon-quote/icon-quote.component';
import { IconQuoteMinusComponent } from '../../icons/icon-quote-minus/icon-quote-minus.component';
import { IconQuotePlusComponent } from '../../icons/icon-quote-plus/icon-quote-plus.component';
import { IconStrikeThroughComponent } from '../../icons/icon-strike-through/icon-strike-through.component';
import { IconUnderlineComponent } from '../../icons/icon-underline/icon-underline.component';
import { IconUnlinkComponent } from '../../icons/icon-unlink/icon-unlink.component';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { WysiwygLinkEditorComponent } from '../wysiwyg-link-editor/wysiwyg-link-editor.component';
import { fadeInOut } from '../../../animations/fade-in-out';
import { slideInOutBottomFull } from '../../../animations/slide-in-out-bottom-full';
import { slideInBottom } from '../../../animations/slide-in-bottom';
import { fadeIn } from '../../../animations/fade-in';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';

@Component({
  selector: 'app-wysiwyg-editor-actions',
  imports: [
    IconBoldComponent,
    IconBracesComponent,
    IconCodeComponent,
    IconHeading1Component,
    IconHeading2Component,
    IconHeading3Component,
    IconItalicComponent,
    IconLinkComponent,
    IconPilcrowComponent,
    IconPilcrowPlusComponent,
    IconQuoteComponent,
    IconQuoteMinusComponent,
    IconQuotePlusComponent,
    IconStrikeThroughComponent,
    IconUnderlineComponent,
    IconUnlinkComponent,
    BackdropComponent,
    BottomSheetComponent,
    WysiwygLinkEditorComponent,
  ],
  templateUrl: './wysiwyg-editor-actions.component.html',
  styleUrl: './wysiwyg-editor-actions.component.scss',
  animations: [fadeInOut(), slideInOutBottomFull(), slideInBottom(), fadeIn()],
})
export class WysiwygEditorActionsComponent implements OnDestroy {
  linkEditorTemplateRef = viewChild<TemplateRef<any>>('linkEditor');

  private linkUpdateTimeout: any;

  private readonly overlayRef = inject(OVERLAY_REF);

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
}
