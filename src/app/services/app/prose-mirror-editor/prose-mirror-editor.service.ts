import { Injectable } from '@angular/core';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

@Injectable()
export class ProseMirrorEditorService {
  /** 서비스 초기 설정 시 EditorState 설정 필요 */
  state?: EditorState;

  /** 서비스 초기 설정 시 EditorView 설정 필요 */
  view?: EditorView;
}
