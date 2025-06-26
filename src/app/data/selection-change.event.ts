/** An event that contains changed selection position for textarea and input elements */
export interface SelectionChangeEvent {
  /** Changed selection start */
  selectionStart: number | null;

  /** Changed selection end */
  selectionEnd: number | null;
}
