import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  isDevMode,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { AngularPlatform } from '../../../utils/platform.utils';
import {
  EmptyContentNodeView,
  getEditorJson,
  isCodeBlockActive,
} from '../../../utils/prosemirror.utils';
import { ProseMirrorEditorService } from '../../../services/app/prose-mirror-editor/prose-mirror-editor.service';
import { VariableColors } from '../../../utils/tailwind.utils';
import { NgClass } from '@angular/common';
import { EditorView } from 'prosemirror-view';
import { keymap } from 'prosemirror-keymap';
import { EditorState } from 'prosemirror-state';

/** WYSIWYG 에디터. <ng-content>로 액션 버튼 사용 가능 */
@Component({
  selector: 'app-wysiwyg-editor',
  imports: [NgClass],
  templateUrl: './wysiwyg-editor.component.html',
  styleUrl: './wysiwyg-editor.component.scss',
  host: {
    class: 'flex flex-col items-stretch',
  },
})
export class WysiwygEditorComponent implements AfterViewInit, OnDestroy {
  theme = input<VariableColors>('blue');

  state = input.required<EditorState>();

  editorClasses = computed(() => {
    const theme = this.theme();

    return {
      [`prose-${theme}`]: true,
    };
  });

  /** 아무것도 처리할 것이 없는 상태에서 Mod-Enter 키 이벤트 발생 시 방출 */
  keyDownModeEnter = output();

  /** 에디터 준비 완료 상태 */
  editorReady = output<ElementRef<HTMLElement>>();

  editorContainerElementRef =
    viewChild<ElementRef<HTMLElement>>('editorContainer');

  private readyEmitTimeout: any;

  private readonly proseMirrorEditorService = inject(ProseMirrorEditorService);

  ngAfterViewInit() {
    this.proseMirrorEditorService.state = this.state();

    const editorContainerElementRef = this.editorContainerElementRef();

    if (AngularPlatform.isBrowser && editorContainerElementRef) {
      this.readyEmitTimeout = setTimeout(() => {
        this.proseMirrorEditorService.view = new EditorView(
          editorContainerElementRef.nativeElement,
          {
            state: this.proseMirrorEditorService.state!,
            attributes: {
              spellcheck: 'false',
            },
            plugins: [
              keymap({
                'Mod-Enter': () => {
                  if (!this.proseMirrorEditorService.view) {
                    return false;
                  }

                  if (isCodeBlockActive(this.proseMirrorEditorService.view)) {
                    return false;
                  }

                  this.keyDownModeEnter.emit();

                  // 기존 동작 막기
                  return true;
                },
              }),
            ],
            nodeViews: {
              paragraph: (node, view, getPos) =>
                new EmptyContentNodeView(node, view, getPos),
              heading: (node, view, getPos) =>
                new EmptyContentNodeView(node, view, getPos),
            },
          },
        );
      });
    }
  }

  ngOnDestroy() {
    clearTimeout(this.readyEmitTimeout);
  }

  getJson(): any | undefined {
    if (!this.proseMirrorEditorService.view) {
      if (isDevMode()) {
        console.error('EditorView를 찾을 수 없습니다');
      }

      return;
    }

    return getEditorJson(this.proseMirrorEditorService.view);
  }
}
