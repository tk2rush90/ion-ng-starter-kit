import { Node as ProseMirrorNode } from 'prosemirror-model';
import { EditorView, ViewMutationRecord } from 'prosemirror-view';
import { BaseNodeView } from './base-node-view';

export class YoutubeEmbedNodeView extends BaseNodeView {
  iframe: HTMLIFrameElement;

  mutationObserver: MutationObserver;

  constructor(
    node: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined,
  ) {
    super(node, view, getPos);

    this.iframe = this.document.createElement('iframe');

    this.iframe.src = `https://www.youtube.com/embed/${this.node.attrs['videoId']}`;
    this.iframe.style.border = 'none';
    this.iframe.allowFullscreen = true;
    this.iframe.classList.add(
      'pointer-events-none',
      'brightness-50',
      'transition-all',
    );

    this.dom.append(this.iframe);
    this.dom.classList.add('prosemirror-no-placeholder');

    this.mutationObserver = new MutationObserver((records) => {
      records.forEach((_record) => {
        if (_record.attributeName === 'class') {
          const target = _record.target as HTMLElement;

          if (target.classList.contains('ProseMirror-selectednode')) {
            this.iframe.classList.remove(
              'pointer-events-none',
              'brightness-50',
            );
          } else {
            this.iframe.classList.add('pointer-events-none', 'brightness-50');
          }
        }
      });
    });

    this.mutationObserver.observe(this.dom, {
      attributes: true,
    });
  }

  ignoreMutation(record: ViewMutationRecord): boolean {
    return record.target === this.iframe;
  }

  update(node: ProseMirrorNode) {
    if (node.type === this.node.type) {
      this.node = node;
      this.iframe.src = `https://www.youtube.com/embed/${this.node.attrs['videoId']}`;

      return true;
    } else {
      return false;
    }
  }

  destroy(): void {
    this.dom.remove();
  }
}
