import { schema as ProseMirrorSchemaBasic } from 'prosemirror-schema-basic';
import {
  EditorState,
  Plugin as ProseMirrorPlugin,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import {
  baseKeymap,
  lift,
  setBlockType,
  toggleMark,
  wrapIn,
} from 'prosemirror-commands';
import {
  DOMSerializer as ProseMirrorDOMSerializer,
  Mark,
  MarkType,
  Node as ProseMirrorNode,
  NodeType,
  Schema,
} from 'prosemirror-model';
import {
  InputRule,
  inputRules,
  textblockTypeInputRule,
  wrappingInputRule,
} from 'prosemirror-inputrules';
import { history, redo, undo } from 'prosemirror-history';
import { dropCursor } from 'prosemirror-dropcursor';
import colors from 'tailwindcss/colors';
import { keymap } from 'prosemirror-keymap';
import {
  addListNodes,
  liftListItem,
  sinkListItem,
  splitListItem,
  wrapInList,
} from 'prosemirror-schema-list';
import { isDevMode } from '@angular/core';
import { ProseMirrorNodeJson } from '../data/prose-mirror-node-json';
import { findParentNodeClosestToPos } from 'prosemirror-utils';

/** 공통 인라인 마크 스펙 */
export const commonInlineMarks = ProseMirrorSchemaBasic.spec.marks
  .update('link', {
    ...ProseMirrorSchemaBasic.spec.marks.get('link'),
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
  });

/** 모든 에디팅을 허용하는 스키마 */
export const defaultSchema = new Schema({
  // 리스트 노드 추가 및 이미지 노드 제거
  nodes: addListNodes(
    ProseMirrorSchemaBasic.spec.nodes,
    'paragraph block*',
    'block',
  ).remove('image'),
  // 인라인 마크 추가
  marks: commonInlineMarks,
});

/** 인라인 에디팅만 허용하는 스키마 */
export const inlineSchema = new Schema({
  // 리스트 노드 추가 및 불필요한 블럭 노드 제거
  nodes: addListNodes(
    ProseMirrorSchemaBasic.spec.nodes,
    'paragraph block*',
    'block',
  )
    .remove('image')
    .remove('heading'),
  // 인라인 마크 추가
  marks: commonInlineMarks,
});

/** 모든 기능이 활성화 된 기본 EditorState 생성 */
export const createDefaultEditorState = (
  schema: Schema = defaultSchema,
  { placeholder }: { placeholder?: string } = {},
) => {
  return EditorState.create({
    schema,
    plugins: [
      unwrapBlockquoteOnEnterPlugin,
      history(),
      createLinkInputRules(schema),
      createCodeInputRules(schema),
      createBlockQuoteInputRules(schema),
      createOrderedListInputRules(schema),
      createUnorderedListInputRules(schema),
      createCodeBlockInputRules(schema),
      createHeadingInputRules(schema),
      selectBlockOrAllPlugin(),
      createPlaceholderPlugin(placeholder),
      dropCursor({
        width: 3,
        color: colors.gray['400'],
        class: 'prosemirror-dropcursor-animation',
      }),
      keymap({
        'Mod-z': undoKeyMap,
        'Mod-s-z': redoKeyMap,
        'Mod-y': redoKeyMap,
        'Mod-b': toggleMarkKeyMap(schema, 'strong'),
        'Mod-u': toggleMarkKeyMap(schema, 'underline'),
        'Mod-i': toggleMarkKeyMap(schema, 'em'),
        Enter: splitListItem(schema.nodes['list_item']),
        Tab: increaseIndentKeyMap(schema),
        'S-Tab': decreaseIndentKeyMap(schema),
      }),
      keymap(baseKeymap),
    ],
  });
};

/** 인라인 에디팅 기능만 활성화 된 EditorState 생성 */
export const createInlineEditorState = (
  schema: Schema = inlineSchema,
  {
    placeholder,
  }: {
    placeholder?: string;
  } = {},
) => {
  return EditorState.create({
    schema,
    plugins: [
      unwrapBlockquoteOnEnterPlugin,
      history(),
      createLinkInputRules(schema),
      createCodeInputRules(schema),
      createBlockQuoteInputRules(schema),
      createOrderedListInputRules(schema),
      createUnorderedListInputRules(schema),
      createCodeBlockInputRules(schema),
      selectBlockOrAllPlugin(),
      createPlaceholderPlugin(placeholder),
      dropCursor({
        width: 3,
        color: colors.gray['400'],
        class: 'prosemirror-dropcursor-animation',
      }),
      keymap({
        'Mod-z': undoKeyMap,
        'Mod-s-z': redoKeyMap,
        'Mod-y': redoKeyMap,
        'Mod-b': toggleMarkKeyMap(schema, 'strong'),
        'Mod-u': toggleMarkKeyMap(schema, 'underline'),
        'Mod-i': toggleMarkKeyMap(schema, 'em'),
        Enter: splitListItem(schema.nodes['list_item']),
        Tab: increaseIndentKeyMap(schema),
        'S-Tab': decreaseIndentKeyMap(schema),
      }),
      keymap(baseKeymap),
    ],
  });
};

/** Enter 키 입력에 따라 인용문 언랩하는 플러그인 */
export const unwrapBlockquoteOnEnterPlugin = new ProseMirrorPlugin({
  props: {
    handleKeyDown: (view: EditorView, event: KeyboardEvent): boolean => {
      // Enter 키가 아니면 처리하지 않음
      if (event.key !== 'Enter') {
        return false;
      }

      const { state } = view;
      const { selection, schema } = state;
      const blockquoteType: NodeType | undefined = schema.nodes['blockquote'];

      // blockquote 노드 타입이 스키마에 없으면 처리하지 않음
      if (!blockquoteType) {
        if (isDevMode()) {
          console.error("Schema does not define a 'blockquote' node type.");
        }

        return false;
      }

      // 선택이 텍스트 선택(TextSelection)이 아니거나, 커서가 아니면 처리하지 않음
      if (
        !(selection instanceof TextSelection) ||
        !selection.empty ||
        !selection.$cursor
      ) {
        return false;
      }

      const $cursor = selection.$cursor;

      // 커서가 해당 블록의 마지막에 있지 않으면 처리하지 않음
      if ($cursor.pos !== $cursor.end()) {
        return false;
      }

      // 커서가 속한 부모 노드
      const parentNode = $cursor.parent;
      // blockquote 노드는 부모의 부모 노드
      const grandparent = $cursor.node($cursor.depth - 1);

      // 커서가 blockquote 내부에 있는지 확인
      if (!grandparent || grandparent.type !== blockquoteType) {
        return false;
      }

      // 현재 라인이 비어있는지 확인
      if (parentNode.content.size > 0) {
        return false;
      }

      // 현재 커서 위치가 blockquote의 마지막 블록인지 확인
      const blockquoteLastChild = grandparent.lastChild;
      if (!blockquoteLastChild || !blockquoteLastChild.eq(parentNode)) {
        return false;
      }

      // 위의 모든 조건을 만족하면 unwrapBlockquote 커맨드를 실행
      // unwrapBlockquote는 이미 Command 타입을 반환하므로 바로 실행 가능
      unwrapBlockquote(view);

      return true;
    },
  },
});

/** 인용문 언랩하는 함수 */
export const unwrapBlockquote = (view: EditorView) => {
  const { state, dispatch } = view;

  // 선택 범위가 blockquote 안에 있는지 확인
  const blockquoteType: NodeType | undefined = state.schema.nodes['blockquote'];

  // blockquote 노드 타입이 스키마에 정의되어 있지 않음
  if (!blockquoteType) {
    if (isDevMode()) {
      console.error("Schema does not define a 'blockquote' node type.");
    }

    return;
  }

  lift(state, dispatch, view);
};

/** 입력에 따른 링크 처리 위한 InputRules 생성 */
export const createLinkInputRules = (schema: Schema): ProseMirrorPlugin => {
  const { link } = schema.marks;

  if (!link) {
    if (isDevMode()) {
      console.error("Schema does not contain a 'link' mark type.");
    }

    return new ProseMirrorPlugin({}); // 링크 마크가 없으면 빈 플러그인 반환
  }

  return inputRules({
    rules: [
      // URL 패턴을 감지하여 링크 마크 적용
      new InputRule(
        /(?:^|\s)((?:https?:\/\/|www\.)[^\s<>"']+?\.[^\s<>"']+(?:\/[^\s<>"']*)?)(\s)$/,
        (state, match, start, end) => {
          const url = match[1]; // 실제 URL (예: "www.google.com")
          const trailingSpace = match[2]; // URL 뒤의 공백 (예: " ")
          let tr = state.tr;

          // 전체 매칭된 텍스트에서 URL의 시작 위치 계산
          // 예: " www.google.com " 에서 "www.google.com"의 시작 위치
          const fullMatchedText = match[0];
          const urlStartIndexInFullMatch = fullMatchedText.indexOf(url);

          // 링크 마크를 적용할 실제 URL의 시작 위치
          const markStartPos = start + urlStartIndexInFullMatch;
          // 링크 마크를 적용할 실제 URL의 끝 위치 (공백 제외)
          const markEndPos = markStartPos + url.length;

          // 1. URL 텍스트에 링크 마크 적용
          tr = tr.addMark(
            markStartPos,
            markEndPos,
            link.create({
              href: url.startsWith('www.') ? `https://${url}` : url,
            }),
          );

          tr = tr.setSelection(TextSelection.create(tr.doc, end));

          tr = tr.insertText(trailingSpace, markEndPos, markEndPos);

          tr = tr.setSelection(
            TextSelection.create(tr.doc, markEndPos + trailingSpace.length),
          );

          return tr;
        },
      ),
    ],
  });
};

/** 백틱 기호를 이용해 인라인 코드를 입력하는 InputRules 생성 함수 */
export const createCodeInputRules = (schema: Schema) => {
  return inputRules({
    rules: [
      new InputRule(/(?:^|\s)`([^`]+)`$/, (state, match, start, end) => {
        const [fullText, codeText] = match;
        const { tr } = state;

        if (codeText) {
          // 백틱 전체 구간 삭제
          tr.delete(start, end);

          // 순수 코드 텍스트 삽입
          tr.insertText(codeText, start);

          // 삽입한 순수 텍스트에만 마크 적용
          tr.addMark(
            start,
            start + codeText.length,
            schema.marks['code'].create(),
          );

          return tr;
        }

        return null;
      }),
    ],
  });
};

/** > 기호를 이용해 인용문 블럭을 입력하는 InputRules 생성 함수 */
export const createBlockQuoteInputRules = (schema: Schema) => {
  return inputRules({
    rules: [wrappingInputRule(/^\s*>\s$/, schema.nodes['blockquote'])],
  });
};

/** 순서 있는 리스트 입력하는 InputRules 생성 함수 */
export const createOrderedListInputRules = (schema: Schema) => {
  return inputRules({
    rules: [
      wrappingInputRule(
        /^(\d+)\.\s$/,
        schema.nodes['ordered_list'],
        (match) => ({ order: +match[1] }),
        (match, node) => node.childCount + node.attrs['order'] == +match[1],
      ),
    ],
  });
};

/** 순서 없는 리스트 입력하는 InputRules 생성 함수 */
export const createUnorderedListInputRules = (schema: Schema) => {
  return inputRules({
    rules: [wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes['bullet_list'])],
  });
};

/** 코드 블럭 입력하는 InputRules 생성 함수 */
export const createCodeBlockInputRules = (schema: Schema) => {
  return inputRules({
    rules: [textblockTypeInputRule(/^```$/, schema.nodes['code_block'])],
  });
};

/** 헤딩 입력하는 InputRules 생성 함수 */
export const createHeadingInputRules = (schema: Schema) => {
  return inputRules({
    rules: [
      textblockTypeInputRule(
        new RegExp('^(#{1,6})\\s$'),
        schema.nodes['heading'],
        (match) => ({
          level: Math.min(match[1].length + 1, 4),
        }),
      ),
    ],
  });
};

/** 에디터가 공백일 때 플레이스홀더 표시하는 플러그인 */
export const createPlaceholderPlugin = (
  placeholderText = '내용을 입력하세요...',
) => {
  return new ProseMirrorPlugin({
    props: {
      decorations(state) {
        const doc = state.doc;
        // 문서가 비어있는지 확인하는 로직 (기본적으로 단락 하나만 있고 그 단락이 비어있는 경우)
        // 스키마에 따라 doc.textContent.length === 0, doc.nodeSize === 2 (empty paragraph) 등으로 조건 변경 가능
        const isEmpty =
          doc.childCount === 1 &&
          doc.firstChild?.isTextblock &&
          doc.firstChild.content.size === 0;

        // 내용이 있으면 데코레이션 없음
        if (!isEmpty) {
          return DecorationSet.empty;
        }

        const placeholderNode = document.createElement('span');
        placeholderNode.classList.add('ProseMirror-placeholder');
        placeholderNode.contentEditable = 'true';
        placeholderNode.textContent = placeholderText;

        // 문서의 시작 부분에 위젯 데코레이션 추가
        // pos: 1 (문서 시작 = 0, 첫 번째 텍스트 블록의 시작 = 1)
        return DecorationSet.create(doc, [
          Decoration.node(0, doc.content.size + 2, {
            // doc 노드 전체 범위에 적용
            class: 'ProseMirror-empty-with-placeholder',
            'data-placeholder': placeholderText, // CSS에서 사용할 데이터 속성
          }),
          // side: -1은 커서가 플레이스홀더 앞에 위치하도록 함
          // stopEvent: true는 플레이스홀더 클릭 시 이벤트를 중단하여 커서가 비정상적으로 위치하는 것을 방지
        ]);
      },
    },
  });
};

/** 키맵 통한 undo 처리 함수 */
export const undoKeyMap = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  view?: EditorView,
) => {
  return undo(state, dispatch, view);
};

/** 키맵 통한 redo 처리 함수 */
export const redoKeyMap = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  view?: EditorView,
) => {
  return redo(state, dispatch, view);
};

/** 키맵 통한 마크 토글 처리 함수 */
export const toggleMarkKeyMap = (schema: Schema, markName: string) => {
  return (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ) => {
    return toggleMark(schema.marks[markName])(state, dispatch, view);
  };
};

/** 키맵 통한 리스트 레벨 증가 처리 함수 */
export const increaseIndentKeyMap = (schema: Schema) => {
  return (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ) => {
    return sinkListItem(schema.nodes['list_item'])(state, dispatch, view);
  };
};

/** 키맵 통한 리스트 레벨 감소 처리 함수 */
export const decreaseIndentKeyMap = (schema: Schema) => {
  return (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ) => {
    return liftListItem(schema.nodes['list_item'])(state, dispatch, view);
  };
};

/** 블럭 혹은 전체 선택 키맵 플러그인 */
export const selectBlockOrAllPlugin = () => {
  return keymap({
    'Mod-a': (state: EditorState, dispatch?: (tr: any) => void): boolean => {
      const { selection, doc } = state;
      const { $from, $to } = selection;

      // 현재 블록 요소 범위 가져오기
      const blockRange = $from.blockRange($to);

      // 현재 블록이 완전히 선택되었는지 확인
      // blockRange.start + 1, blockRange.end - 1은 블록 내부 콘텐츠의 시작/끝을 의미
      // 텍스트 노드가 없는 빈 블록 (예: <p></p> 에서 커서)의 경우 start + 1 >= end - 1 일 수 있음
      const isBlockFullySelected =
        blockRange &&
        $from.pos === blockRange.start + 1 && // 선택 시작이 블록 콘텐츠 시작과 일치
        $to.pos === blockRange.end - 1; // 선택 끝이 블록 콘텐츠 끝과 일치

      // 현재 블록이 완전히 선택되지 않았고, 블록 내부에 선택 가능한 내용이 있는 경우
      // (start + 1 < end - 1 는 블록 내부에 최소 한 칸 이상의 공간이 있다는 의미)
      if (
        !isBlockFullySelected &&
        blockRange &&
        blockRange.start + 1 < blockRange.end - 1
      ) {
        // 현재 블록 전체 선택
        if (dispatch) {
          const newSelection = TextSelection.create(
            doc,
            blockRange.start + 1, // 블록 콘텐츠 시작
            blockRange.end - 1, // 블록 콘텐츠 끝
          );
          dispatch(state.tr.setSelection(newSelection));
        }
        return true; // 이벤트를 처리했음을 알림
      }

      // 현재 블록이 이미 완전히 선택되었거나, 블록 내부에 선택할 내용이 없는 경우 (빈 블록 등)
      // 에디터 전체 선택
      if (dispatch) {
        // doc.content.size는 문서의 총 길이 (마지막 닫는 노드 뒤의 위치 포함)
        // 따라서 1 (doc 시작) 부터 doc.content.size - 1 (doc 마지막 닫는 노드 앞) 까지 선택하면 전체 콘텐츠가 선택됨
        const newSelection = TextSelection.create(doc, 1, doc.content.size - 1);
        dispatch(state.tr.setSelection(newSelection));
      }
      return true; // 이벤트를 처리했음을 알림
    },
  });
};

/** ProseMirror JSON 데이터를 HTML 문자열로 변환하는 함수 */
export const jsonToHtml = (
  jsonDoc: any,
  {
    schema,
    overriddenDocument,
  }: { schema: Schema; overriddenDocument?: Document },
): string => {
  const doc: ProseMirrorNode = schema.nodeFromJSON(jsonDoc);

  const serializer = ProseMirrorDOMSerializer.fromSchema(schema);

  const fragment = serializer.serializeFragment(doc.content, {
    document: overriddenDocument,
  });

  const container = (overriddenDocument || document).createElement('div');

  container.appendChild(fragment);

  return container.innerHTML;
};

/** 커서 위치에 특정 마크가 활성화 돼있는지 확인하는 함수. 링크 마크는 isLinkMarkActive() 사용 */
export const isMarkActive = (view: EditorView, mark: string) => {
  const { state } = view;

  const { schema } = state;

  const { from, $from, to, empty } = state.selection;

  const markType = schema.marks[mark];

  if (!markType) {
    if (isDevMode()) {
      console.error(`${mark} 마크 설정이 존재하지 않습니다`);
    }

    return false;
  }

  if (empty) {
    return !!markType.isInSet(state.storedMarks || $from.marks());
  } else {
    let found = false;

    state.doc.nodesBetween(from, to, (node) => {
      if (markType.isInSet(node.marks)) {
        found = true;

        return;
      }

      return;
    });

    return found;
  }
};

/** 현재 커서 위치에서 코드 블럭이 적용되어 있는지 확인하는 함수 */
export const isCodeBlockActive = (view: EditorView) => {
  const { state } = view;
  const { selection, doc, schema } = state;
  const codeBlockType = schema.nodes['code_block']; // 스키마에서 code_block 노드 타입 가져오기

  if (!codeBlockType) {
    if (isDevMode()) {
      console.error('code_block 노드 설정이 존재하지 않습니다');
    }

    return false; // 스키마에 code_block이 정의되어 있지 않으면 false 반환
  }

  const { from, to } = selection;

  if (selection.empty) {
    // 커서 collapsed
    const $pos = selection.$head;

    // $pos.node(depth)는 특정 깊이의 조상 노드를 반환
    // $pos.depth는 현재 노드의 최상위 노드의 깊이
    // depth를 1부터 $pos.depth 까지 반복하여 조상 노드를 검사
    for (let i = $pos.depth; i > 0; i--) {
      // depth 0은 문서 자체이므로 제외
      const ancestor = $pos.node(i);

      if (ancestor.type === codeBlockType) {
        return true;
      }
    }

    return false;
  } else {
    // 커서 expanded
    // 선택 범위의 시작점과 끝점 사이의 노드들을 순회하며 `code_block`이 있는지 확인
    let foundCodeBlock = false;

    doc.nodesBetween(from, to, (node) => {
      // 현재 노드가 code_block 타입인지 확인
      if (node.type === codeBlockType) {
        foundCodeBlock = true;
        return false;
      }

      return true;
    });

    // 선택 범위 내의 모든 노드를 검사했는데도 code_block이 발견되지 않았다면,
    // 선택 범위가 code_block의 '내부'에 완전히 포함되어 있는지 추가 확인
    // 즉, 선택 범위의 가장 바깥쪽 부모가 code_block인지 검사
    if (!foundCodeBlock) {
      const $from = selection.$from;
      const $to = selection.$to;

      // 선택 범위의 양 끝점의 조상 노드들을 검사하여 code_block이 있는지 확인
      let commonAncestor = $from.sharedDepth($to.pos);

      if (commonAncestor >= 0) {
        const ancestor = $from.node(commonAncestor);
        if (ancestor.type === codeBlockType) {
          foundCodeBlock = true;
        }
      }

      if (!foundCodeBlock && $from.parent.type === codeBlockType) {
        foundCodeBlock = true;
      }
    }

    return foundCodeBlock;
  }
};

/** 현재 커서가 헤딩 블럭인지 확인하는 함수 */
export const isHeadingActive = (view: EditorView, targetLevel?: number) => {
  const { state } = view;

  const { selection } = state;

  if (!selection.empty) {
    return false;
  }

  const { $cursor } = selection as TextSelection;

  if (!$cursor) {
    return false;
  }

  const parentNode = $cursor.parent;

  if (parentNode.type === state.schema.nodes['heading']) {
    if (targetLevel === undefined) {
      return true;
    } else {
      const currentLevel = parentNode.attrs['level'];

      return currentLevel === targetLevel;
    }
  }

  return false;
};

/** 현재 커서 위치에 인용문이 적용되어있는지 확인하는 함수 */
export const isBlockQuoteActive = (view: EditorView) => {
  const { state } = view;

  const { selection } = state;

  if (!(selection instanceof TextSelection)) {
    return false;
  }

  const $pos = selection.$cursor;

  if (!$pos) {
    return false;
  }

  for (let i = $pos.depth; i > 0; i--) {
    const ancestor = $pos.node(i);

    if (ancestor.type === state.schema.nodes['blockquote']) {
      return true;
    }
  }

  return false;
};

export const isCursorInList = (
  view: EditorView,
  type?: 'ordered_list' | 'bullet_list',
): boolean => {
  const { state } = view;

  const { $cursor } = state.selection as TextSelection;

  if (!$cursor) {
    return false;
  }

  for (let i = $cursor.depth; i > 0; i--) {
    const node = $cursor.node(i);

    if (node.type.name === 'ordered_list' || node.type.name === 'bullet_list') {
      if (type) {
        return node.type.name === type;
      } else {
        return true;
      }
    }
  }

  return false;
};

/** 커서 위치에 링크 마크가 적용되어 있는지 확인하고 링크 마크 리턴 */
export const findLinkMark = (view: EditorView) => {
  const { state } = view;

  const { selection, schema } = state;
  const linkType: MarkType | undefined = schema.marks['link'];

  if (!linkType) {
    if (isDevMode()) {
      console.error('link 마크 설정이 존재하지 않습니다');
    }

    return null;
  }

  if (selection instanceof TextSelection) {
    const { from, to, $cursor, empty } = selection;

    if (empty && $cursor) {
      const marksAtCursor = $cursor.marks();

      const storedMarks = state.storedMarks;

      const linkInMarks = linkType.isInSet(marksAtCursor);

      if (linkInMarks) {
        return linkInMarks;
      }

      if (storedMarks) {
        const linkInStoredMarks = linkType.isInSet(storedMarks);

        if (linkInStoredMarks) {
          return linkInStoredMarks;
        }
      }
    } else {
      let commonLinkMark: Mark | undefined = undefined;
      let hasNonLinkContent = false;

      const marksAtFrom = state.doc.resolve(from).marks();
      const marksAtTo = state.doc.resolve(to).marks();

      const linkAtFrom = linkType.isInSet(marksAtFrom);
      const linkAtTo = linkType.isInSet(marksAtTo);

      if (linkAtFrom && linkAtTo && linkAtFrom.eq(linkAtTo)) {
        commonLinkMark = linkAtFrom;
      } else {
        return null;
      }

      state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.isText) {
          const currentLinkInNode = linkType.isInSet(node.marks);
          if (!currentLinkInNode || !currentLinkInNode.eq(commonLinkMark!)) {
            hasNonLinkContent = true;
            return false;
          }
        } else if (node.isBlock) {
          if (pos + node.nodeSize > to || pos < from) {
            return true;
          }

          if (!node.isText) {
            hasNonLinkContent = true;
            return false;
          }
        }

        return true;
      });

      if (commonLinkMark && !hasNonLinkContent) {
        return commonLinkMark;
      }
    }
  }

  return null;
};

/** 현재 Selection 범위 리턴 */
export const getCurrentSelectionRange = (
  view: EditorView,
): { from: number; to: number } => {
  const { state } = view;

  const { selection } = state;

  return { from: selection.from, to: selection.to };
};

/** 선택된 범위에 링크 마크 적용하는 함수. 링크는 항상 범위로만 설정 가능 */
export const setLinkMark = (
  view: EditorView,
  {
    from,
    to,
    href,
    title = null,
  }: { from: number; to: number; href: string; title?: string | null },
) => {
  const { state, dispatch } = view;

  const linkType: MarkType | undefined = state.schema.marks['link'];

  if (!linkType) {
    if (isDevMode()) {
      console.error('link 마크 설정이 존재하지 않습니다');
    }

    return;
  }

  // 링크 마크 생성
  const linkMark: Mark = linkType.create({ href, title });

  // 트랜잭션 생성 및 링크 마크 추가
  let tr = state.tr;
  tr.addMark(from, to, linkMark);

  // 트랜잭션 디스패치
  dispatch(tr);
};

/** 커서 위치에서 링크 제거. 커서가 링크 내에 있을 경우 링크 전체를 선택한 뒤 제거 */
export const removeLinkMark = (view: EditorView) => {
  const { state, dispatch } = view;
  const { selection, schema } = state;
  const linkType: MarkType | undefined = schema.marks['link'];

  if (!linkType) {
    if (isDevMode()) {
      console.error('link 마크 설정이 존재하지 않습니다');
    }

    return;
  }

  if (
    !(selection instanceof TextSelection) ||
    !selection.empty ||
    !selection.$cursor
  ) {
    return;
  }

  const linkMark = getLinkMarkByCursor(view);

  if (!linkMark) {
    return;
  }

  let tr = state.tr;

  // storedMarks에서 링크 마크를 제거
  tr.setStoredMarks(linkMark.removeFromSet(state.storedMarks || []));

  const { from, to } = selection;

  if (linkType.isInSet(state.doc.resolve(from).marks())) {
    let linkStart = from;
    let linkEnd = to;

    // 링크의 시작점 찾기
    while (
      linkStart > 0 &&
      linkType.isInSet(state.doc.resolve(linkStart - 1).marks())
    ) {
      linkStart--;
    }

    // 링크의 끝점 찾기
    while (
      linkEnd < state.doc.content.size &&
      linkType.isInSet(state.doc.resolve(linkEnd).marks())
    ) {
      linkEnd++;
    }
    tr.removeMark(linkStart - 1, linkEnd, linkType);
  }

  if (dispatch) {
    dispatch(tr.scrollIntoView());
  }
};

/** 현재 커서 위치에서 markType과 일치하는 마크 범위를 선택 */
export const selectMark = (view: EditorView, mark: string) => {
  const { state, dispatch } = view;

  const { schema } = state;

  const markType = schema.marks[mark];

  if (!markType) {
    if (isDevMode()) {
      console.error(`${mark} 마크 설정이 존재하지 않습니다`);
    }

    return;
  }

  const { tr, selection } = state;

  if (!(selection instanceof TextSelection)) {
    return;
  }

  const { $from, $to } = selection;

  if (!$from.parent) {
    return;
  }

  let linkFound = false;
  let linkStart = -1;
  let linkEnd = -1;

  const marksAtCursor = $from.marks();
  const currentLinkMark = marksAtCursor.find((mark) => mark.type === markType);

  if (currentLinkMark) {
    const fromPosInParent = $from.pos - $from.start();
    const toPosInParent = $to.pos - $from.start();

    $from.parent.nodesBetween(
      fromPosInParent,
      toPosInParent,
      (node, posInParent) => {
        if (node.isText) {
          node.marks.forEach((mark) => {
            if (mark.type === markType) {
              const resolvedStart = $from.start() + posInParent;
              const resolvedEnd = resolvedStart + node.nodeSize;

              if (linkStart === -1 || resolvedStart < linkStart) {
                linkStart = resolvedStart;
              }

              if (linkEnd === -1 || resolvedEnd > linkEnd) {
                linkEnd = resolvedEnd;
              }

              linkFound = true;
            }
          });
        }

        return true;
      },
    );
  } else {
    state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
      node.marks.forEach((mark) => {
        if (mark.type === markType) {
          if (linkStart === -1 || pos < linkStart) {
            linkStart = pos;
          }

          if (linkEnd === -1 || pos + node.nodeSize > linkEnd) {
            linkEnd = pos + node.nodeSize;
          }

          linkFound = true;
        }
      });
    });
  }

  if (linkFound && linkStart !== -1 && linkEnd !== -1) {
    const newSelection = TextSelection.create(tr.doc, linkStart, linkEnd);

    if (!newSelection.eq(selection)) {
      dispatch(tr.setSelection(newSelection));
    }
  }
};

/** TextSelection이 expanded 상태인지 확인하는 함수 */
export const isSelectionExpanded = (view: EditorView): boolean => {
  const { state } = view;
  const { selection } = state;

  // TextSelection 인스턴스이면서 empty가 false인 경우
  return selection instanceof TextSelection && !selection.empty;
};

/** EditorView의 내용을 플레인 텍스트로 변환 */
export const getEditorPlainText = (view: EditorView): string => {
  const { state } = view;

  return state.doc.textBetween(0, state.doc.content.size, '\n\n');
};

/** 현재 커서 이후에 paragraph 노드 추가하는 함수 */
export const insertParagraph = (view: EditorView) => {
  const { state, dispatch } = view;

  const { selection, schema } = state;

  const nodeType = schema.nodes['paragraph'];

  if (!nodeType) {
    if (isDevMode()) {
      console.error('paragraph 노드 설정이 존재하지 않습니다');
    }

    return;
  }

  const $pos = selection.$head;
  const blockRange = $pos.blockRange();

  if (!blockRange) {
    if (isDevMode()) {
      console.error(
        '현재 선택을 포함하는 블록을 찾을 수 없습니다. 선택이 문서의 루트에 직접 있을 수 있습니다.',
      );
    }

    return;
  }

  const insertPos = blockRange.end;

  const newParagraph = nodeType.createAndFill();

  if (!newParagraph) {
    if (isDevMode()) {
      console.error('새 단락 노드를 생성하지 못했습니다.');
    }

    return;
  }

  let tr = state.tr;

  tr = tr.insert(insertPos, newParagraph);

  tr = tr.setSelection(Selection.near(tr.doc.resolve(insertPos)));

  tr = tr.scrollIntoView();

  dispatch(tr);
};

/** 현재 커서 위치에 링크 마크가 설정되어 있는지 확인하는 함수 */
export const isLinkMarkActive = (view: EditorView) => {
  const { state } = view;
  const { selection } = state;

  if (!(selection instanceof TextSelection)) {
    return false;
  }

  const { $cursor } = selection;

  if ($cursor) {
    // $cursor가 있는 경우 범위 선택이 아님
    return $cursor.marks().some((mark: Mark) => mark.type.name === 'link');
  } else {
    // 범위 선택에 대한 확인
    const { from, to, $from, $to } = selection;
    const { doc } = state;

    let commonLinkMark: Mark | null = null;

    const startMarks = $from.marks();
    if (startMarks) {
      for (const mark of startMarks) {
        if (mark.type.name === 'link') {
          commonLinkMark = mark;
          break;
        }
      }
    }

    if (!commonLinkMark) {
      return false;
    }

    const endMarks = $to.marks();

    let endHasCommonLink = false;

    if (endMarks) {
      for (const mark of endMarks) {
        if (mark.eq(commonLinkMark)) {
          endHasCommonLink = true;
          break;
        }
      }
    }

    if (!endHasCommonLink) {
      return false;
    }

    let allContentCoveredByLink = true;

    doc.nodesBetween(from, to, (node) => {
      if (node.isText) {
        if (!node.marks.some((mark) => mark.eq(commonLinkMark))) {
          allContentCoveredByLink = false;
          return false;
        }
      } else if (node.isInline && !node.isText) {
        if (!node.marks.some((mark) => mark.eq(commonLinkMark))) {
          allContentCoveredByLink = false;
          return false;
        }
      }

      return true;
    });

    return allContentCoveredByLink;
  }
};

/** 커서 위치에 블럭 노드 적용하는 함수. options는 블럭 노드에 전달할 추가 옵션 */
export const setBlockNode = (
  view: EditorView,
  node: string,
  options: { level?: number } = {},
) => {
  const { state, dispatch } = view;

  const { schema } = state;

  const nodeType = schema.nodes[node];

  if (!nodeType) {
    if (isDevMode()) {
      console.error(`${node} 노드 설정이 존재하지 않습니다`);
    }

    return;
  }

  setBlockType(nodeType, options)(state, dispatch, view);
};

/** 커서 위치에 마크 적용하는 함수 */
export const toggleInlineMark = (view: EditorView, mark: string) => {
  const { state, dispatch } = view;

  const { schema } = state;

  const markType = schema.marks[mark];

  if (!markType) {
    if (isDevMode()) {
      console.error(`${mark} 마크 설정이 존재하지 않습니다`);
    }

    return;
  }

  toggleMark(markType)(state, dispatch, view);
};

/** 블럭 노드를 현재 커서 위치에서 wrapIn 하는 함수 */
export const warpInBlockNode = (view: EditorView, node: string) => {
  const { state, dispatch } = view;

  const { schema } = state;

  const nodeType = schema.nodes[node];

  if (!nodeType) {
    if (isDevMode()) {
      console.error(`${node} 노드 설정이 존재하지 않습니다`);
    }

    return;
  }

  wrapIn(nodeType)(state, dispatch, view);
};

export const toggleList = (
  view: EditorView,
  type: 'ordered_list' | 'bullet_list',
) => {
  const { state, dispatch } = view;
  const { schema } = state;
  const { $from, $to } = state.selection;

  const targetListType = schema.nodes[type];
  const itemType = schema.nodes['list_item'];

  const range = $from.blockRange($to);

  if (!range) {
    return false;
  }

  const isList = (nodeType: any) =>
    nodeType === schema.nodes['bullet_list'] ||
    nodeType === schema.nodes['ordered_list'];

  const parentDepth = range.depth - 1;
  const parent = $from.node(parentDepth);
  const grandParent = $from.node(parentDepth - 1);

  const inList = isList(grandParent?.type) && parent?.type === itemType;
  const currentListType = inList ? grandParent.type : null;

  if (currentListType === targetListType) {
    return liftListItem(itemType)(state, dispatch);
  }

  if (inList && currentListType && currentListType !== targetListType) {
    if (!dispatch) return true;
    const listPos = $from.before(parentDepth);
    const listNode = state.doc.nodeAt(listPos);
    if (!listNode || listNode.type !== currentListType) return false;

    const newList = targetListType.create(
      listNode.attrs,
      listNode.content,
      listNode.marks,
    );

    const tr = state.tr.replaceWith(
      listPos,
      listPos + listNode.nodeSize,
      newList,
    );
    dispatch(tr);
    return true;
  }

  return wrapInList(targetListType)(state, dispatch);
};

export const changeList = (
  view: EditorView,
  type: 'ordered_list' | 'bullet_list',
): void => {
  const { state, dispatch } = view;
  const { tr, selection } = state;
  const { $from } = selection;

  let listNode: any | null = null;
  let listNodePos = -1;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (node.type.name.endsWith('_list')) {
      listNode = node;
      listNodePos = $from.start(i) - 1;
      break;
    }
  }

  if (listNode && listNodePos !== -1) {
    const targetNodeType: NodeType = state.schema.nodes[type];

    if (targetNodeType && targetNodeType !== listNode.type) {
      const start = listNodePos;
      const end = listNodePos + listNode.nodeSize;

      const newListNode = targetNodeType.create(
        listNode.attrs,
        listNode.content,
      );

      dispatch(tr.replaceRangeWith(start, end, newListNode));
    }
  }
};

export const indentList = (view: EditorView) => {
  const { state, dispatch } = view;

  const { schema } = state;

  return sinkListItem(schema.nodes['list_item'])(state, dispatch);
};

export const outdentList = (view: EditorView) => {
  const { state, dispatch } = view;

  const { schema } = state;

  return liftListItem(schema.nodes['list_item'])(state, dispatch);
};

export const isFirstListItem = (view: EditorView) => {
  const { state } = view;
  const { schema } = state;
  const { selection, doc } = state;

  let isFirstListItemInItsList = false;

  doc.nodesBetween(
    selection.from,
    selection.to,
    (node: ProseMirrorNode, pos: number) => {
      if (node.type === schema.nodes['list_item']) {
        const $pos = doc.resolve(pos);

        if ($pos.parent.type.name.includes('list') && $pos.index() === 0) {
          isFirstListItemInItsList = true;
        }
      }
    },
  );

  return isFirstListItemInItsList;
};

/** EditorView의 내용을 JSON으로 변환해 가져오는 함수 */
export const getEditorJson = (view: EditorView) => {
  return view.state.doc.toJSON();
};

/** JSON 데이터를 에디터 뷰에 적용. 기존 데이터 대체 */
export const applyEditorJson = (
  view: EditorView,
  json: ProseMirrorNodeJson,
) => {
  const { state, dispatch } = view;

  const { schema, doc: oldDoc } = state;

  const newDoc = ProseMirrorNode.fromJSON(schema, json);

  const transaction = state.tr.replaceWith(0, oldDoc.content.size, newDoc);

  dispatch(transaction);
};

export const convertJsonToRawContent = (
  schema: Schema,
  json: any,
  limit?: number,
): string => {
  let content = '';

  ProseMirrorNode.fromJSON(schema, json).descendants((node) => {
    if (!node.text) {
      return;
    }

    content += node.text;

    if (limit !== undefined && content.length > limit) {
      return;
    }
  });

  return limit !== undefined ? content.slice(0, limit) : content;
};

export const getLinkMarkByCursor = (view: EditorView): Mark | null => {
  const { state } = view;

  const { selection, schema } = state;
  const linkType: MarkType | undefined = schema.marks['link'];

  // 스키마에 'link' 마크 타입이 정의되어 있지 않으면, 링크를 감지할 수 없습니다.
  if (!linkType) {
    console.warn("Schema does not define a 'link' mark type.");
    return null;
  }

  // 1. 텍스트 선택(TextSelection)인 경우를 처리합니다.
  if (selection instanceof TextSelection) {
    const { from, to, $cursor, empty } = selection;

    // 1-1. 커서 선택 (collapsed selection)인 경우:
    if (empty && $cursor) {
      // 커서 바로 앞의 텍스트 노드에 적용된 마크들을 확인합니다.
      const marksAtCursor = $cursor.marks();
      // 사용자가 링크를 적용한 후 아직 텍스트를 입력하지 않은 상태일 때 (예: 툴바에서 '링크' 클릭)
      // 임시로 저장된 마크(storedMarks)도 확인합니다.
      const storedMarks = state.storedMarks;

      // 현재 커서 위치의 마크에 링크 마크가 있는지 확인합니다.
      const linkInMarks = linkType.isInSet(marksAtCursor);

      if (linkInMarks) {
        return linkInMarks;
      }

      // 저장된 마크에 링크 마크가 있는지 확인합니다.
      if (storedMarks) {
        const linkInStoredMarks = linkType.isInSet(storedMarks);

        if (linkInStoredMarks) {
          return linkInStoredMarks;
        }
      }
    }
    // 1-2. 범위 선택 (ranged selection)인 경우:
    else {
      let commonLinkMark: Mark | undefined = undefined;
      let hasNonLinkContent = false;

      // 선택 영역의 시작과 끝이 같은 링크 마크 안에 있는지 먼저 확인
      const marksAtFrom = state.doc.resolve(from).marks();
      const marksAtTo = state.doc.resolve(to).marks();

      const linkAtFrom = linkType.isInSet(marksAtFrom);
      const linkAtTo = linkType.isInSet(marksAtTo);

      if (linkAtFrom && linkAtTo && linkAtFrom.eq(linkAtTo)) {
        commonLinkMark = linkAtFrom; // 잠재적인 공통 링크 마크
      } else {
        // 시작점과 끝점에 동일한 링크가 없으면, 전체 범위가 하나의 링크 안에 있다고 볼 수 없음
        return null;
      }

      // 이제 선택 범위 내의 모든 텍스트 노드를 순회하며 해당 'commonLinkMark'만 있는지 확인합니다.
      state.doc.nodesBetween(from, to, (node, pos) => {
        // 텍스트 노드에만 마크가 적용됩니다.
        if (node.isText) {
          const currentLinkInNode = linkType.isInSet(node.marks);
          if (!currentLinkInNode || !currentLinkInNode.eq(commonLinkMark!)) {
            // 해당 텍스트 노드에 링크가 없거나,
            // (commonLinkMark가 있다면) commonLinkMark와 동일하지 않은 링크가 있다면
            // 전체 범위가 하나의 링크 안에 있다고 볼 수 없습니다.
            hasNonLinkContent = true;
            return false; // 더 이상 탐색할 필요 없음
          }
        } else if (node.isBlock) {
          // 블록 노드 (단락, 제목 등)를 만나면 그 안의 콘텐츠를 확인합니다.
          // ProseMirror는 마크가 블록 경계를 넘어갈 수 없습니다.
          // 따라서 선택 범위 안에 블록 노드가 있다면, 해당 블록 전체가 링크일 수는 있어도
          // 단일 텍스트 노드에 적용된 링크와는 다른 구조가 됩니다.
          // 이 함수는 텍스트 마크(inline)의 활성 상태를 확인하는 데 중점을 둡니다.
          // 만약 선택 범위에 텍스트가 아닌 다른 블록 노드(예: 이미지 노드, 표)가 있다면
          // 이는 "동일한 하나의 링크 안에 포함"이라는 조건에 부합하지 않을 수 있습니다.
          // 여기서는 'isText'가 아닌 블록 노드를 만나면 `false`로 처리하도록 하여
          // 순수하게 인라인 텍스트 링크에 대한 판단을 강화합니다.
          // (선택 범위에 링크가 없는 블록 노드가 포함되면 링크는 활성화된 것으로 보지 않음)
          if (pos + node.nodeSize > to || pos < from) {
            // 선택 범위 밖의 블록 노드는 건너뜀
            return true;
          }
          // 블록 노드인데 텍스트 노드가 아니면, 단일 링크 안에 있다고 보기 어려움
          if (!node.isText) {
            hasNonLinkContent = true;
            return false;
          }
        }
        return true; // 계속 탐색
      });

      if (commonLinkMark && !hasNonLinkContent) {
        // 모든 조건 만족: 시작점과 끝점에 같은 링크가 있고, 중간에 링크가 아닌 콘텐츠가 없었음
        return commonLinkMark;
      }
    }
  }
  // 2. 다른 종류의 선택 (예: NodeSelection)인 경우:
  // NodeSelection의 경우, 해당 노드 자체에 텍스트 콘텐츠가 있고 그 안에 링크가 있을 수 있지만,
  // 일반적으로는 텍스트 선택에 대해 링크 활성 상태를 확인하는 경우가 많습니다.
  // 필요하다면 이 부분에 NodeSelection에 대한 추가 로직을 구현할 수 있습니다.

  // 링크가 활성화된 상태가 아니면 false를 반환합니다.
  return null;
};

/** List를 다른 유형의 List로 전환하는 함수 */
export const convertListToList = (
  view: EditorView,
  target: 'ordered_list' | 'bullet_list',
): void => {
  const { state, dispatch } = view;

  const { selection } = state;

  const { $from } = selection; // 커서 또는 선택 영역의 시작점

  // 커서 위치에서 가장 가까운 상위 리스트 노드를 찾기
  const parentList = findParentNodeClosestToPos(
    $from,
    (node) =>
      node.type.name === 'ordered_list' || node.type.name === 'bullet_list',
  );

  if (!parentList) {
    return;
  }

  const { node: listNode, pos: listPos } = parentList;

  if (listNode.type.name !== 'ordered_list') {
    return;
  }

  const bulletListType: NodeType | undefined = state.schema.nodes[target];

  if (!bulletListType) {
    return;
  }

  // 4. 리스트 노드 타입을 전환하는 트랜잭션을 생성합니다.
  // replaceWith를 사용하여 노드를 새로운 타입의 노드로 교체합니다.
  const tr = state.tr.replaceWith(
    listPos, // 전환할 노드의 시작 위치
    listPos + listNode.nodeSize, // 전환할 노드의 끝 위치
    bulletListType.create(null, listNode.content), // 새 bullet_list 노드 생성 (기존 콘텐츠 유지)
  );

  dispatch(tr);
};

export class EmptyContentNodeView {
  dom: HTMLElement;

  contentDOM: HTMLElement;

  node: ProseMirrorNode;

  constructor(
    node: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined,
  ) {
    this.node = node;
    this.dom = document.createElement(
      node.type.name === 'paragraph' ? 'p' : `h${node.attrs['level']}`,
    );
    this.contentDOM = this.dom;
    this.updateClass();
  }

  update(node: ProseMirrorNode) {
    if (
      node.type !== this.node.type ||
      (node.type.name === 'heading' &&
        node.attrs['level'] !== this.node.attrs['level'])
    ) {
      return false;
    }
    this.node = node;
    this.updateClass();
    return true;
  }

  updateClass() {
    const isEmpty = this.node.textContent.trim().length === 0;

    if (isEmpty) {
      this.dom.classList.add('ProseMirror-textEmpty');
    } else {
      this.dom.classList.remove('ProseMirror-textEmpty');
    }
  }

  destroy() {}
}
