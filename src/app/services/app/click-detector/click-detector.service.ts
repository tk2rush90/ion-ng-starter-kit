import { Injectable } from '@angular/core';
import { AngularPlatform } from '../../../utils/platform.utils';
import { Logger } from '../../../utils/logger.utils';

/** An interface for data that contains information about detecting clicking */
export interface ClickDetectionData {
  target: Node;
  insideClickDetected: boolean;
  outsideClickDetected: boolean;
  onInsideClick?: () => void;
  onOutsideClick?: () => void;
}

/**
 * A service that manages inside or outside click of Node.
 * It adds event listener to window to detect clicking target.
 */
@Injectable({
  providedIn: 'root',
})
export class ClickDetectorService {
  /** Click detection data */
  detectionData: ClickDetectionData[] = [];

  /** Logger */
  private readonly logger = new Logger('ClickDetectorService');

  constructor() {
    if (AngularPlatform.isBrowser) {
      window.addEventListener('mousedown', this.mousedownListener);
      window.addEventListener('mouseup', this.mouseupListener);
    }
  }

  /**
   * Detect inside or outside click event for `target`.
   * @param target
   *  Target to detect clicking position. When click event triggered from the inside of `target`,
   *  `onInsideClick` callback will be called. When click event triggered from the outside of `target`,
   *  `onOutsideClick` callback will be called.
   * @param onInsideClick - Callback function to be called when inside click detected.
   * @param onOutsideClick - Callback function to be called when outside click detected.
   */
  detectClick(
    target: Node,
    {
      onInsideClick,
      onOutsideClick,
    }: { onInsideClick?: () => void; onOutsideClick?: () => void },
  ): void {
    this.detectionData.push({
      target,
      insideClickDetected: false,
      outsideClickDetected: false,
      onInsideClick,
      onOutsideClick,
    });
  }

  /**
   * Cancel detection for `target` node.
   * @param target - Target node to cancel click detection.
   */
  cancelDetect(target: Node): void {
    const targetDetectionData = this.detectionData.find(
      (_data) => _data.target === target,
    );

    if (targetDetectionData) {
      this.detectionData = this.detectionData.filter(
        (_data) => _data !== targetDetectionData,
      );
    }
  }

  /** Listener of window mousedown to detect clicking start target */
  private mousedownListener = (event: MouseEvent) => {
    this.detectionData.forEach((_data) => {
      // Update `insideClickDetected` status.
      _data.insideClickDetected =
        event.target instanceof Node && _data.target.contains(event.target);

      // Update `outsideClickDetected` status.
      _data.outsideClickDetected =
        event.target instanceof Node && !_data.target.contains(event.target);

      if (_data.insideClickDetected) {
        this.logger.log('Inside mousedown detected');
      }

      if (_data.outsideClickDetected) {
        this.logger.log('Outside mousedown detected');
      }
    });
  };

  /** Listener of window mouseup to detect clicking end target */
  private mouseupListener = (event: MouseEvent) => {
    this.detectionData.forEach((_data) => {
      // Check whether click event end from the inside.
      const insideMouseUpDetected =
        event.target instanceof Node && _data.target.contains(event.target);

      // Check whether click event end from the outside.
      const outsideMouseUpDetected =
        event.target instanceof Node && !_data.target.contains(event.target);

      // When click event triggered from the inside, call `onInsideClick()`.
      if (_data.insideClickDetected && insideMouseUpDetected) {
        this.logger.log('Inside click detected');

        _data.insideClickDetected = false;

        if (_data.onInsideClick) {
          _data.onInsideClick();
        }
      }

      // When click event triggered from the outside, call `onOutsideClick()`.
      if (_data.outsideClickDetected && outsideMouseUpDetected) {
        this.logger.log('Outside click detected');

        _data.outsideClickDetected = false;

        if (_data.onOutsideClick) {
          _data.onOutsideClick();
        }
      }
    });
  };
}
