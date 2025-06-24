import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  isDevMode,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { AngularPlatform } from '../../../utils/platform.utils';
import { getEditorJson } from '../../../utils/prosemirror.utils';
import { ProseMirrorEditorService } from '../../../services/app/prose-mirror-editor/prose-mirror-editor.service';

/** WYSIWYG 에디터. <ng-content>로 액션 버튼 사용 가능 */
@Component({
  selector: 'app-wysiwyg-editor',
  imports: [],
  templateUrl: './wysiwyg-editor.component.html',
  styleUrl: './wysiwyg-editor.component.scss',
  host: {
    class: 'flex-col-stretch',
  },
})
export class WysiwygEditorComponent implements AfterViewInit, OnDestroy {
  /**
   * 에디터 준비 완료 상태. 에디터의 container 요소에 대한 ElementRef 방출.
   * 컴포넌트 외부에서 ProseMirrorEditorService에 view 설정해줘야 함
   */
  editorReady = output<ElementRef<HTMLElement>>();

  editorContainerElementRef =
    viewChild<ElementRef<HTMLElement>>('editorContainer');

  private readyEmitTimeout: any;

  private readonly proseMirrorEditorService = inject(ProseMirrorEditorService);

  ngAfterViewInit() {
    const editorContainerElementRef = this.editorContainerElementRef();

    if (AngularPlatform.isBrowser && editorContainerElementRef) {
      this.readyEmitTimeout = setTimeout(() =>
        this.editorReady.emit(editorContainerElementRef),
      );
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
