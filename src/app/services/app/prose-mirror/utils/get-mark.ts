import { Mark } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

export function getMark(view: EditorView, name: string): Mark | undefined {
  const acrossFrom = view.state.selection.$from
    .marksAcross(view.state.selection.$from)
    ?.find((_mark) => _mark.type.name === name);

  const acrossTo = view.state.selection.$from
    .marksAcross(view.state.selection.$to)
    ?.find((_mark) => _mark.type.name === name);

  return (
    (acrossFrom && acrossTo && acrossFrom === acrossTo
      ? acrossFrom
      : undefined) ||
    view.state.selection.$from
      .marks()
      .find((_mark) => _mark.type.name === name) ||
    view.state.storedMarks?.find((_mark) => _mark.type.name === name)
  );
}
