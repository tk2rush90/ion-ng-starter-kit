import { Node as ProseMirrorNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { NodeSelection } from 'prosemirror-state';

export function getNode(
  view: EditorView,
  name: string,
): ProseMirrorNode | undefined {
  if (view.state.selection instanceof NodeSelection) {
    if (view.state.selection.node.type.name === name) {
      return view.state.selection.node;
    }
  }

  return;
}
