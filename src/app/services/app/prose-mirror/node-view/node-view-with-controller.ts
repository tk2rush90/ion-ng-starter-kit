import { EditorView, ViewMutationRecord } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { BaseNodeView } from './base-node-view';

export abstract class NodeViewWithController extends BaseNodeView {
  actions: HTMLElement;

  mutationObserver: MutationObserver;

  protected constructor(
    node: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined,
  ) {
    super(node, view, getPos);

    this.node = node;
    this.view = view;
    this.getPos = getPos;

    this.document = this.view.root as Document;

    // 상속받은 dom 제거
    this.dom.remove();

    this.dom = this.document.createElement('div');
    this.dom.classList.add(
      'relative',
      'prosemirror-no-placeholder', // 이미지 노드에서 placeholder 표시하지 않기 위해 추가
    );
    this.dom.contentEditable = 'true';

    this.actions = this.document.createElement('div');
    this.actions.classList.add(
      'flex-center-start',
      'rounded',
      'p-1',
      'bg-white',
      'gap-0.5',
      'absolute',
      'top-full',
      'right-0',
      'translate-y-2',
      'opacity-0',
      'pointer-events-none',
      'transition-all',
      'z-50',
    );

    const addButton = this.document.createElement('button');

    addButton.type = 'button';
    addButton.classList.add(
      'flex-center',
      'size-7',
      'bg-white',
      'hover:brightness-110',
      'active:brightness-125',
      'transition-all',
      'rounded',
    );
    addButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';

    const removeButton = this.document.createElement('button');

    removeButton.type = 'button';
    removeButton.classList.add(
      'flex-center',
      'size-7',
      'bg-white',
      'hover:brightness-110',
      'active:brightness-125',
      'transition-all',
      'rounded',
    );
    removeButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

    addButton.addEventListener('click', (event) => {
      event.preventDefault();

      this.addParagraph();
    });

    removeButton.addEventListener('click', (event) => {
      event.preventDefault();

      this.destroy();
    });

    this.actions.append(addButton, removeButton);

    this.dom.append(this.actions);

    this.mutationObserver = new MutationObserver((records) => {
      records.forEach((_record) => {
        if (_record.attributeName === 'class') {
          const target = _record.target as HTMLElement;

          if (target.classList.contains('ProseMirror-selectednode')) {
            this.showActions();
          } else {
            this.hideActions();
          }
        }
      });
    });

    this.mutationObserver.observe(this.dom, {
      attributes: true,
    });
  }

  showActions(): void {
    this.actions.classList.add('opacity-100');
    this.actions.classList.remove('opacity-0', 'pointer-events-none');
  }

  hideActions(): void {
    this.actions.classList.add('opacity-0', 'pointer-events-none');
    this.actions.classList.remove('opacity-100');
  }

  addParagraph(): void {
    const { state, dispatch } = this.view;
    const { tr, schema, selection } = state;
    const { $from } = selection;

    const rootBlockPos = $from.start(1);

    let transaction = tr.insert(
      rootBlockPos,
      schema.nodes['paragraph'].create(),
    );

    transaction = transaction.setSelection(
      TextSelection.create(transaction.doc, rootBlockPos + 1),
    );

    dispatch(transaction);
  }

  ignoreMutation(mutation: ViewMutationRecord): boolean {
    return this.actions === mutation.target;
  }

  destroy() {
    this.dom.remove();
    this.mutationObserver.disconnect();
  }
}
