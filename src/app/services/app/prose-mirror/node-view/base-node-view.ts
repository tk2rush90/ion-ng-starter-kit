import { EditorView, NodeView } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';

export abstract class BaseNodeView implements NodeView {
  static fromElement(element: HTMLElement): void {
    throw new Error('fromElement() method is not implemented');
  }

  node: ProseMirrorNode;

  view: EditorView;

  getPos: () => number | undefined;

  dom: HTMLElement;

  document: Document;

  contentDOM?: HTMLElement | null;

  protected constructor(
    node: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined,
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    this.document = this.view.root as Document;

    this.dom = this.document.createElement('div');
  }
}
