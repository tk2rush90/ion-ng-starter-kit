export interface DragAndDropOptions {
  /** 드래그가 처음 활성화 되었을 때 호출하는 콜백 함수 */
  onDragStart?: (element: Element | undefined) => void;
  /** 드래그가 활성화 된 채로 mousemove, touchmove 이벤트가 발생했을 때 호출하는 콜백 함수 */
  onDragging?: (element: Element | undefined) => void;
  /** 드래그 중 드랍존이 활성화 됐을 때 호출하는 콜백 함수 */
  onDropzoneActivated?: (
    element: Element | undefined,
    dropzone: Element,
  ) => void;
  /** 드래그 중 어떤 드랍존도 활성화 되어 있지 않은 상태일 때 호출하는 콜백 함수 */
  onDropzoneDeactivated?: (element: Element | undefined) => void;
  /** 드랍존 내/외 상관없이 mouseup, touchend, touchcancel 이멘트가 발생했을 때 호출하는 콜백 함수 */
  onDrop?: (element: Element | undefined, dropzone?: Element) => void;
  /**
   * mousedown 이벤트 발생 시 드래그가 활성화 되기 위해 필요한 이동 거리
   * 값이 설정된 경우 mousedown 후 설정된 거리만큼 mousemove가 발생해야 드래그 활성화
   * 기본은 즉시 드래그 활성화
   */
  mouseDownTriggerDistance?: number;
  /**
   * touchstart 이벤트 발생 시 드래그가 활성화 되기 위해 필요한 대기 시간
   * 값이 설정된 경우 설정된 시간의 밀리초만큼 touch가 유지돼야 드래그 활성화
   * 기본은 즉시 드래그 활성화
   */
  touchStartTriggerTimer?: number;
}
