import { Node as ProseMirrorNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { BaseNodeView } from './base-node-view';
import { ProseMirrorService } from '../prose-mirror.service';

export class ImageNodeView extends BaseNodeView {
  image: HTMLImageElement;

  caption?: HTMLElement;

  constructor(
    node: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined,
    private readonly proseMirrorService: ProseMirrorService,
  ) {
    super(node, view, getPos);

    this.image = this.document.createElement('img');

    this.image.src = this.node.attrs['src'];
    this.image.alt = this.node.attrs['alt'] || '';
    this.image.title = this.node.attrs['title'] || '';
    this.image.loading = 'lazy';

    this.dom.append(this.image);
    this.renderCaption();
    this.dom.classList.add('relative', 'prosemirror-no-placeholder');
    this.dom.setAttribute('draggable', 'true');
    this.dom.addEventListener('dragstart', this.onDragStart.bind(this));
  }

  onDragStart(event: DragEvent) {
    this.proseMirrorService.draggingFileUrls.push(this.image.src);
  }

  update(node: ProseMirrorNode) {
    if (node.type === this.node.type) {
      this.node = node;
      this.image.src = this.node.attrs['src'];
      this.image.alt = this.node.attrs['alt'];
      this.image.title = this.node.attrs['title'];

      this.renderCaption();

      return true;
    } else {
      return false;
    }
  }

  renderCaption(): void {
    this.caption?.remove();

    if (this.node.attrs['alt']) {
      this.caption = this.document.createElement('div');
      this.caption.classList.add(
        'text-center',
        'text-base',
        'md:text-lg',
        'text-gray-400',
        'break-all',
        'mb-8',
      );
      this.caption.innerText = this.node.attrs['alt'];
      this.dom.append(this.caption);
    }

    if (this.caption) {
      this.dom.classList.add('prose-img:mb-1');
    } else {
      this.dom.classList.remove('prose-img:mb-1');
    }
  }

  destroy() {
    if (!this.proseMirrorService.draggingFileUrls.includes(this.image.src)) {
      this.proseMirrorService.removeFileByObjectUrl(this.image.src);
    }

    this.dom.remove();
  }
}
