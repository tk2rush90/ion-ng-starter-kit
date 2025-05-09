import { EventEmitter, Inject, Injectable, OnDestroy } from '@angular/core';
import {
  EditorState,
  NodeSelection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { schema } from 'prosemirror-schema-basic';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import {
  baseKeymap,
  setBlockType,
  toggleMark,
  wrapIn,
} from 'prosemirror-commands';
import { DOMParser, Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import {
  addListNodes,
  liftListItem,
  sinkListItem,
  splitListItem,
} from 'prosemirror-schema-list';
import { dropCursor } from 'prosemirror-dropcursor';
import colors from 'tailwindcss/colors';
import {
  InputRule,
  inputRules,
  textblockTypeInputRule,
  wrappingInputRule,
} from 'prosemirror-inputrules';
import { ToastService } from '../toast/toast.service';
import { getMark } from './utils/get-mark';
import { YoutubeEmbedNodeView } from './node-view/youtube-embed-node-view';
import { ProseMirrorFile } from '../../../data/prose-mirror-file';
import { ImageNodeView } from './node-view/image-node-view';
import { ProseMirrorNodeJson } from '../../../data/prose-mirror-node-json';
import { DOCUMENT } from '@angular/common';
import { MarkdownService } from '../markdown/markdown.service';
import { getNode } from './utils/get-node';
import { fileToBase64 } from '../../../utils/file.utils';

@Injectable()
export class ProseMirrorService implements OnDestroy {
  files: ProseMirrorFile[] = [];

  onReady = new EventEmitter<void>();

  draggingFileUrls: string[] = [];

  /** 커스텀 스키마 */
  readonly schema = new Schema({
    nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block')
      .update('image', {
        ...schema.spec.nodes.get('image'),
        inline: false,
        group: 'block',
      })
      .addToEnd('youtube_embed', {
        inline: false,
        group: 'block',
        attrs: {
          videoId: { default: '' }, // YouTube 비디오 ID
        },
        parseDOM: [
          {
            tag: 'iframe[src]',
            getAttrs: (dom) => {
              const src = dom.getAttribute('src');

              if (src) {
                const match = src.match(
                  /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
                );

                return match ? { videoId: match[1] } : false;
              }

              return false;
            },
          },
        ],
        toDOM: (node) => {
          const { videoId } = node.attrs;

          return [
            'iframe',
            {
              src: `https://www.youtube.com/embed/${videoId}`,
              frameborder: '0',
              allowfullscreen: 'true',
            },
          ];
        },
      }),
    marks: schema.spec.marks
      .update('link', {
        ...schema.spec.marks.get('link'),
        attrs: {
          href: {},
          title: { default: null },
        },
        inclusive: false,
        parseDOM: [
          {
            tag: 'a[href]',
            getAttrs: (dom) => {
              return {
                href: dom.getAttribute('href'),
                title: dom.getAttribute('title'),
              };
            },
          },
        ],
        toDOM: (node) => {
          return [
            'a',
            { ...node.attrs, target: '_blank', rel: 'noopener noreferrer' },
            0,
          ];
        },
      })
      .addToEnd('underline', {
        parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
        toDOM: () => {
          return ['u', 0];
        },
      })
      .addToEnd('strike', {
        parseDOM: [
          { tag: 'strike' },
          { tag: 's' },
          { style: 'text-decoration=line-through' },
        ],
        toDOM: () => {
          return ['s', 0];
        },
      })
      .addToEnd('code', {
        inclusive: false,
        parseDOM: [{ tag: 'code' }],
        toDOM: () => {
          return ['code', 0];
        },
      }),
  });

  private resetDraggingTimeout: any;

  private readonly state: EditorState;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly toastService: ToastService,
    private readonly markdownService: MarkdownService,
  ) {
    // 내부에서 사용되는 this의 바인딩을 위해
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.toggleBold = this.toggleBold.bind(this);
    this.toggleUnderline = this.toggleUnderline.bind(this);
    this.toggleItalic = this.toggleItalic.bind(this);
    this.toggleCode = this.toggleCode.bind(this);
    this.increaseIndent = this.increaseIndent.bind(this);
    this.decreaseIndent = this.decreaseIndent.bind(this);

    this.state = EditorState.create({
      schema: this.schema,
      plugins: [
        history(),
        dropCursor({
          width: 3,
          color: colors.gray['400'],
          class: 'prosemirror-dropcursor-animation',
        }),
        inputRules({
          rules: [
            wrappingInputRule(/^\s*>\s$/, this.schema.nodes['blockquote']),
            wrappingInputRule(
              /^(\d+)\.\s$/,
              this.schema.nodes['ordered_list'],
              (match) => ({ order: +match[1] }),
              (match, node) =>
                node.childCount + node.attrs['order'] == +match[1],
            ),
            wrappingInputRule(
              /^\s*([-+*])\s$/,
              this.schema.nodes['bullet_list'],
            ),
            // `` 기호를 코드로 변환하는 룰
            new InputRule(/(?:^|\s)`([^`]+)`$/, (state, match, start, end) => {
              const [fullText, codeText] = match;
              const { tr } = state;

              if (codeText) {
                // 1️⃣ 백틱 전체 구간 삭제
                tr.delete(start, end);

                // 2️⃣ 순수 코드 텍스트 삽입
                tr.insertText(codeText, start);

                // 3️⃣ 삽입한 순수 텍스트에만 마크 적용
                tr.addMark(
                  start,
                  start + codeText.length,
                  this.schema.marks['code'].create(),
                );

                return tr;
              }
              return null;
            }),
            textblockTypeInputRule(/^```$/, this.schema.nodes['code_block']),
            textblockTypeInputRule(
              new RegExp('^(#{1,6})\\s$'),
              this.schema.nodes['heading'],
              (match) => ({
                level: match[1].length,
              }),
            ),
          ],
        }),
        keymap({
          'Mod-z': this.undo,
          'Mod-s-z': this.redo,
          'Mod-y': this.redo,
          'Mod-b': this.toggleBold,
          'Mod-u': this.toggleUnderline,
          'Mod-i': this.toggleItalic,
          Enter: splitListItem(this.schema.nodes['list_item']),
          Tab: this.increaseIndent,
          'S-Tab': this.decreaseIndent,
          'Mod-e': this.toggleCode,
        }),
        keymap(baseKeymap),
      ],
    });
  }

  view?: EditorView;

  ngOnDestroy() {
    this.view?.destroy();

    clearTimeout(this.resetDraggingTimeout);
  }

  createView(parentElement: HTMLElement): void {
    this.view = new EditorView(parentElement, {
      state: this.state,
      attributes: { spellcheck: 'false' },
      nodeViews: {
        image: (node, view, getPos) => {
          return new ImageNodeView(node, view, getPos, this);
        },
        youtube_embed: (node, view, getPos) => {
          return new YoutubeEmbedNodeView(node, view, getPos);
        },
      },
      decorations: (state) => {
        const doc = state.doc;
        const decorations: Decoration[] = [];

        // 문서의 각 노드를 검사하여 빈 블록에 데코레이션 추가
        doc.descendants((node, pos) => {
          if (node.isBlock && node.childCount === 0) {
            decorations.push(
              Decoration.node(pos, pos + node.nodeSize, {
                class: 'prosemirror-placeholder',
                'data-placeholder': '내용을 입력하세요',
              }),
            );
          }
        });

        return DecorationSet.create(doc, decorations);
      },
      dispatchTransaction: (transaction) => {
        const view = this.view;

        if (view) {
          view.updateState(view.state.apply(transaction));

          this.scrollToCenter();
        }
      },
      handleKeyDown: (view, event) => {
        const { state, dispatch } = view;
        const { selection, doc } = state;
        const { $from, $to } = selection;

        if (event.ctrlKey && event.key === 'a') {
          // Ctrl+A 시 현재 블럭 노드가 선택되어 있지 않으면 현재 블럭 노드 선택
          // 이후 한 번 더 Ctrl+A를 하면 에디터 전체 컨텐츠 선택
          // 현재 블럭 노드가 비어 잇어도 전체 컨텐츠 선택
          // start + 1, end - 1을 해줘야 내부 텍스트만 선택됨
          // 그냥 start, end 를 사용하면 요소 바깥으로 선택되기 때문에 의도치 않은 오류 발생
          // 현재 블록 요소 범위 가져오기
          const blockRange = $from.blockRange($to);

          // 현재 블록이 완전히 선택되었는지 확인
          const isBlockFullySelected =
            blockRange &&
            $from.pos === blockRange.start + 1 &&
            $to.pos === blockRange.end - 1;

          if (!isBlockFullySelected) {
            // 현재 블록 전체 선택
            if (blockRange && blockRange.start + 1 < blockRange.end - 1) {
              const newSelection = TextSelection.create(
                doc,
                blockRange.start + 1,
                blockRange.end - 1,
              );

              dispatch(state.tr.setSelection(newSelection));

              return true;
            }
          }

          // 에디터 전체 선택
          const newSelection = TextSelection.create(
            doc,
            1,
            doc.content.size - 1,
          );

          dispatch(state.tr.setSelection(newSelection));

          return true;
        } else if (event.key === 'Enter') {
          const { state, dispatch } = view;
          const { $from } = state.selection;
          const parent = $from.parent;
          const parentType = parent.type;
          const paragraphType = state.schema.nodes['paragraph'];

          if (parentType.name === 'code_block') {
            event.preventDefault(); // 기본 Enter 동작 방지

            let canExitCodeBlock = false; // 코드 블럭 벗어날 수 있는지 여부
            let focusToPrevious = false; // 이전 블럭으로 커서 이동 여부

            // 1. 코드 블록이 비어 있는 경우
            if (parent.content.size === 0) {
              canExitCodeBlock = true;
            } else {
              // 2. 코드 블록의 마지막/첫번째 줄이 비어 있는 경우
              const codeBlockText = parent.textContent;
              const lines = codeBlockText.split('\n'); // 텍스트 내용을 줄 단위로 분할
              const lastLine = lines[lines.length - 1];
              const firstLine = lines[0];

              // 커서가 코드 블록의 마지막/첫번째 위치에 있고, 마지막/첫번째 줄이 비어 있는지 확인
              if (
                $from.parentOffset === parent.content.size &&
                lastLine.trim() === ''
              ) {
                canExitCodeBlock = true;
              } else if (
                $from.pos === $from.start() &&
                firstLine.trim() === ''
              ) {
                canExitCodeBlock = true;
                focusToPrevious = true;
              }
            }

            if (canExitCodeBlock) {
              const paragraph = paragraphType.create();
              const transaction = state.tr.replaceWith(
                $from.pos - 1,
                $from.pos + 1,
                paragraph,
              );

              if (focusToPrevious) {
                transaction.setSelection(
                  TextSelection.create(transaction.doc, $from.pos),
                );
              } else {
                transaction.setSelection(
                  TextSelection.create(transaction.doc, $from.pos + 1),
                );
              }

              dispatch(transaction);

              return true;
            }

            // 3. 코드 블록에 내용이 있는 경우, 기본 Enter 동작 허용 (새 줄 추가 - <br/> 태그)
            return false;
          }
        }

        // `inclusive`: false 속성으로 인해 필요 없어졌을 듯?
        // else if (event.key === ' ' && isMark(view, 'link')) {
        //   this.removeMarkBySpace(view, 'link', event);
        // }
        // else if (event.key === ' ' && isMark(view, 'code')) {
        //   this.removeMarkBySpace(view, 'code', event);
        // }

        return false;
      },
      // 이미지 붙여넣기 시 ObjectURL로 src 설정
      // 붙여넣기 된 이미지는 files 배열에 추가
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;

        if (items) {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.type.startsWith('image/')) {
              const file = item.getAsFile();

              if (file) {
                this.insertImageFile(view, file);

                event.preventDefault();

                return true;
              }
            }
          }
        }

        return false;
      },
      // 이미지 드롭 시 ObjectURL로 src 설정
      // 드롭 된 이미지는 files 배열에 추가
      handleDrop: (view, event) => {
        const dataTransfer = event.dataTransfer;

        if (dataTransfer?.files?.length) {
          const file = dataTransfer.files[0];

          fileToBase64(file).then((base64) => {
            const dragging = this.draggingFileUrls.includes(base64);

            // 드래그 중인 파일이 아닐 경우 files에 추가
            if (!dragging && file.type.startsWith('image/')) {
              this.files.push({
                originalFile: file,
                objectUrl: base64,
              });
            }
          });
        }

        clearTimeout(this.resetDraggingTimeout);

        this.resetDraggingTimeout = setTimeout(() => {
          this.draggingFileUrls = [];
        });

        return false;
      },
    });

    this.onReady.emit();
  }

  undo(
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean {
    return undo(state, dispatch, view);
  }

  redo(
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean {
    return redo(state, dispatch, view);
  }

  toggleBold(
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean {
    return toggleMark(this.schema.marks['strong'])(state, dispatch, view);
  }

  toggleItalic(
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean {
    return toggleMark(this.schema.marks['em'])(state, dispatch, view);
  }

  toggleUnderline(
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean {
    return toggleMark(this.schema.marks['underline'])(state, dispatch, view);
  }

  toggleLineThrough(
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean {
    return toggleMark(this.schema.marks['strike'])(state, dispatch, view);
  }

  insertParagraph(view: EditorView): void {
    const { state, dispatch } = view;

    // 새 paragraph 노드를 생성
    const paragraphNode = state.schema.nodes['paragraph'].create();

    const position = state.selection.$from.pos + 1;

    // 트랜잭션을 통해 새 paragraph 삽입
    let transaction = state.tr.insert(position, paragraphNode);

    // 추가한 지점에서 한 번 더 +1을 해줘야 올바른 컨텐츠 수정 가능
    transaction = transaction.setSelection(
      TextSelection.create(transaction.doc, position + 1),
    );

    dispatch(transaction);
  }

  insertBlockQuote(
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean {
    return wrapIn(this.schema.nodes['blockquote'])(state, dispatch, view);
  }

  increaseIndent(
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean {
    return sinkListItem(this.schema.nodes['list_item'])(state, dispatch, view);
  }

  decreaseIndent(
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean {
    return liftListItem(this.schema.nodes['list_item'])(state, dispatch, view);
  }

  toggleHeading(level: number): boolean {
    if (this.view) {
      return setBlockType(this.schema.nodes['heading'], { level })(
        this.view.state,
        this.view.dispatch,
        this.view,
      );
    }

    return false;
  }

  toggleParagraph(): boolean {
    if (this.view) {
      return setBlockType(this.schema.nodes['paragraph'])(
        this.view.state,
        this.view.dispatch,
        this.view,
      );
    }

    return false;
  }

  setCodeBlock(): boolean {
    if (this.view) {
      return setBlockType(this.schema.nodes['code_block'])(
        this.view.state,
        this.view.dispatch,
        this.view,
      );
    }

    return false;
  }

  toggleCode(
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean {
    return toggleMark(this.schema.marks['code'])(state, dispatch, view);
  }

  setLink(href: string): boolean {
    const view = this.view;

    if (view) {
      const { state, dispatch } = view;

      let { from, to } = state.selection;

      dispatch(
        state.tr.addMark(from, to, this.schema.marks['link'].create({ href })),
      );

      return true;
    }

    return false;
  }

  selectMark(name: string): void {
    const view = this.view;

    if (view) {
      const { state, dispatch } = view;
      const { $from } = state.selection;

      // 현재 커서 위치에서 적용된 마크 확인
      const mark = $from.marks().find((_mark) => _mark.type.name === name);

      // 적용된 마크 없음
      if (!mark) {
        return;
      }

      let start = $from.pos;
      let end = $from.pos;

      state.doc.nodesBetween($from.before(), $from.after(), (node, pos) => {
        if (node.isText) {
          const marks = node.marks.filter((_mark) => _mark.type.name === name);

          if (marks.length > 0) {
            start = Math.min(start, pos);
            end = Math.max(end, pos + node.nodeSize);
          }
        }
      });

      // 새로운 텍스트 선택 영역 설정
      const transaction = state.tr.setSelection(
        TextSelection.create(state.doc, start, end),
      );

      dispatch(transaction);
    }
  }

  removeMark(name: string): void {
    const view = this.view;

    if (view) {
      const { state, dispatch } = view;
      const { from, to } = state.selection;

      const transaction = state.tr.removeMark(
        from,
        to,
        this.schema.marks[name],
      );

      dispatch(transaction);
    }
  }

  setCaption(caption: string): void {
    if (caption && this.view) {
      const imageNode = getNode(this.view, 'image');

      if (imageNode) {
        this.view.dispatch(
          this.view.state.tr.setNodeMarkup(
            this.view.state.selection.from,
            null,
            {
              ...imageNode.attrs,
              alt: caption,
            },
          ),
        );
      }
    }
  }

  removeCaption(): void {
    if (this.view) {
      const imageNode = getNode(this.view, 'image');

      if (imageNode) {
        this.view.dispatch(
          this.view.state.tr.setNodeMarkup(
            this.view.state.selection.from,
            null,
            {
              ...imageNode.attrs,
              alt: undefined,
            },
          ),
        );
      }
    }
  }

  insertYoutubeEmbed(url: string): boolean {
    if (this.view) {
      const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([a-zA-Z0-9_-]+)/,
      );

      if (!match) {
        this.toastService.open({
          message: '잘못된 유튜브 영상 링크입니다',
        });
        return false;
      }

      const videoId = match[1]; // 비디오 ID 추출

      const { state, dispatch } = this.view;
      const { tr, selection } = state;
      const { $from } = selection;

      const rootBlockPos = $from.start(1);
      const rootBlockNode = $from.node(1);
      // 컨텐츠가 없는 노드의 경우 rootBlockNode가 undefined일 수도 있기 때문에 이에 다른 처리
      // rootBlockNode가 있을 때 nodeSize에서 1을 뺴는 이유는 1을 빼지 않으면 노드 바깥을 선택하기 때문
      const rootBlockEndPos = rootBlockNode
        ? rootBlockPos + rootBlockNode.nodeSize - 1
        : rootBlockPos;

      let transaction = tr.insert(
        rootBlockEndPos,
        state.schema.nodes['youtube_embed'].create({
          videoId,
        }),
      );

      transaction = transaction.setSelection(
        NodeSelection.create(transaction.doc, rootBlockEndPos),
      );

      dispatch(transaction);

      return true;
    }

    return false;
  }

  async insertImageFile(view: EditorView, file: File): Promise<void> {
    const { state, dispatch } = view;
    const { tr, schema, selection } = state;
    const { $from } = selection;

    const rootBlockPos = $from.start(1);
    const rootBlockNode = $from.node(1);
    // 컨텐츠가 없는 노드의 경우 rootBlockNode가 undefined일 수도 있기 때문에 이에 다른 처리
    // rootBlockNode가 있을 때 nodeSize에서 1을 뺴는 이유는 1을 빼지 않으면 노드 바깥을 선택하기 때문
    const rootBlockEndPos = rootBlockNode
      ? rootBlockPos + rootBlockNode.nodeSize - 1
      : rootBlockPos;

    const objectUrl = await fileToBase64(file);

    let transaction = tr.insert(
      rootBlockEndPos,
      schema.nodes['image'].create({
        src: objectUrl,
      }),
    );

    transaction = transaction.setSelection(
      NodeSelection.create(transaction.doc, rootBlockEndPos),
    );

    dispatch(transaction);

    this.files.push({
      originalFile: file,
      objectUrl,
    });
  }

  removeNode(view: EditorView): void {
    const { state, dispatch } = view;

    const { selection } = state;

    if (selection instanceof TextSelection) {
      // 현재 선택된 영역을 기준으로 부모 노드를 찾습니다.
      const parentNode = selection.$from.node(selection.$from.depth - 1);

      // 선택이 텍스트나 범위에 있으면 작업을 진행합니다.
      if (parentNode) {
        // 부모 노드를 삭제하려면 lift 명령어를 사용할 수 있습니다.
        const tr = state.tr;

        // 선택된 노드를 삭제하는 트랜잭션을 생성합니다.
        tr.delete(selection.from, selection.to);

        // 트랜잭션을 dispatch하여 상태를 업데이트합니다.
        if (dispatch) {
          dispatch(tr);
        }
      }
    } else if (selection instanceof NodeSelection) {
      let transaction = state.tr.delete(selection.from, selection.to);

      const nearSelection = TextSelection.near(transaction.selection.$from);

      const newSelection = TextSelection.create(
        transaction.doc,
        nearSelection.from,
      );

      transaction = transaction.setSelection(newSelection);

      dispatch(transaction);
    }
  }

  /** 제공된 objectUrl을 가진 파일 제거 */
  removeFileByObjectUrl(objectUrl: string): void {
    this.files = this.files.filter((_file) => {
      return _file.objectUrl !== objectUrl;
    });
  }

  scrollToCenter(): void {
    const view = this.view;

    if (view) {
      const { from } = view.state.selection;

      let dom: Node | HTMLElement | null = view.domAtPos(from).node;

      if (dom instanceof Text) {
        // TextNode일 경우 상위 부모 Element 선택
        dom = dom.parentElement;
      } else if (dom === this.view?.dom) {
        // 해당 포지션에 editable 요소가 없기 때문에, offset을 이용해 노드를 조회
        dom = this.view.dom.childNodes.item(view.domAtPos(from).offset);
      }

      if (
        dom instanceof HTMLElement &&
        (dom.getBoundingClientRect().top < 110 ||
          dom.getBoundingClientRect().bottom > window.innerHeight - 60)
      ) {
        dom.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    }
  }

  getJson(): ProseMirrorNodeJson | undefined {
    return this.view?.state.doc.toJSON();
  }

  setJson(json: ProseMirrorNodeJson): void {
    const doc = ProseMirrorNode.fromJSON(this.schema, json);

    if (this.view) {
      this.view.dispatch(
        this.view.state.tr.replaceWith(
          0,
          this.view.state.doc.content.size,
          doc.content,
        ),
      );
    }
  }

  setHtmlString(html: string): void {
    const view = this.view;

    if (view) {
      const div = this.document.createElement('div');

      div.innerHTML = html;

      const node = DOMParser.fromSchema(this.schema).parse(div);

      view.dispatch(
        view.state.tr.replaceWith(
          0,
          view.state.doc.content.size,
          node.content.content,
        ),
      );

      div.remove();
    }
  }

  setMarkdown(markdown: string): void {
    const html = this.markdownService.render(markdown);

    const div = this.document.createElement('div');

    div.innerHTML = html;

    // 이미지 paragraph 태그에서 추출
    div.querySelectorAll('img').forEach((img) => {
      const parentElement = img.parentElement;

      if (parentElement) {
        div.insertBefore(img, parentElement);
      }
    });

    this.setHtmlString(div.innerHTML);
  }

  private removeMarkBySpace(
    view: EditorView,
    name: string,
    event: KeyboardEvent,
  ): boolean {
    const { state, dispatch } = view;
    const { selection } = state;
    const { $from, $to } = selection;

    // inline code에서 처음, 끝 공백 입력 시 code 벗어나는 코드
    // inline code 마크가 있는 경우
    let position: number | undefined;

    // mark의 시작 오프셋
    let startOffset: number | undefined;

    // mark의 끝 오프셋
    let endOffset: number | undefined;

    const mark = getMark(view, name);

    const parent = $from.parent;

    parent.forEach((node, offset) => {
      if (node.marks.some((_mark) => _mark === mark)) {
        // 현재 마크 범위의 시작과 끝 계산
        startOffset = $from.start() + offset;
        endOffset = startOffset + node.nodeSize;
      }
    });

    if (startOffset === $from.pos) {
      // 커서가 마크의 시작점에 있는 경우 커서 이전에 공백 추가
      position = $from.pos - 1;
    } else if (endOffset === $from.pos) {
      // 커서가 마크의 끝점에 있는 경우 커서 다음에 공백 추가
      position = $to.pos + 1;
    }

    if (position !== undefined) {
      event.preventDefault();

      const textNode = state.schema.text(' ');

      let transaction = state.tr.replaceSelectionWith(textNode, false);

      transaction = transaction.setSelection(
        TextSelection.create(transaction.doc, position),
      );

      dispatch(transaction);

      return true;
    }

    return false;
  }
}
