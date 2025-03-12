import { EditorView } from 'prosemirror-view';

/** 현재 제공된 이름을 가진 마크가 활성화 되어있는지 여부 리턴 */
export function isMark(view: EditorView, name: string): boolean {
  const acrossFrom = view.state.selection.$from
    .marksAcross(view.state.selection.$from)
    ?.find((_mark) => _mark.type.name === name);

  const acrossTo = view.state.selection.$from
    .marksAcross(view.state.selection.$to)
    ?.find((_mark) => _mark.type.name === name);

  return (
    !!(name === 'link' && acrossFrom) || // link 마크는 커서가 마크의 끝에 있을 때 인식이 안됨. 왜 안되는지?
    !!(acrossFrom && acrossTo && acrossFrom === acrossTo) ||
    view.state.selection.$from
      .marks()
      .some((_mark) => _mark.type.name === name) ||
    view.state.storedMarks?.some((_mark) => _mark.type.name === name) ||
    false
  );
}
