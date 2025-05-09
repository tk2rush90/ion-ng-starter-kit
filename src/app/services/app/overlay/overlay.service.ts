import {
  ApplicationRef,
  DestroyRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { OverlayOutletComponent } from '../../../components/common/overlay-outlet/overlay-outlet.component';
import { AngularPlatform } from '../../../utils/platform.utils';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';

/** Options to open overlay */
export interface OverlayOptions {
  /** Any context to pass to overlay */
  context?: any;

  /**
   * `DestroyRef` to destroy overlay on destroying component.
   *  When it's not provided, overlay only can be destroyed manually.
   */
  destroyRef: DestroyRef | undefined;

  /** Callback to call when destroying EmbeddedViewRef. */
  onDestroy?: () => void;

  /** Set to allow opening duplicated template at once */
  allowDuplicated?: boolean;

  /** Set to prevent closing on click outside */
  preventOutsideClosing?: boolean;

  /** Set to prevent closing overlay by Escape key */
  preventKeyboardClosing?: boolean;

  parentOverlayRef?: OverlayRef | null;
}

/** Reference of opened overlay */
export interface OverlayRef<C = any> {
  /** Rendered `EmbeddedViewRef` of overlay */
  embeddedViewRef?: EmbeddedViewRef<C>;

  /** Original `TemplateRef` of overlay */
  templateRef: TemplateRef<C>;

  /** Keyboard closing prevented status */
  keyboardClosingPrevented: boolean;

  /** Outside closing prevented status */
  outsideClosingPrevented: boolean;

  /** `keyboardClosingPrevented`의 원래 값을 기록해두기 위함 */
  initialKeyboardClosingPrevented: boolean;

  /** `outsideClosingPrevented`의 원래 값을 기록해두기 위함 */
  initialOutsideClosingPrevented: boolean;

  /** Overlay ready status. Outside closing works after ready*/
  ready: boolean;

  /** Close overlay */
  close: () => void;

  parentOverlayRef?: OverlayRef | null;
}

/** A service to open overlays */
@Injectable({
  providedIn: 'root',
})
export class OverlayService implements OnDestroy {
  /** Opened overlays */
  private openedOverlayRefs: OverlayRef[] = [];

  /**
   * By default, opening an overlay will create viewContainerRef to render overlay.
   * Once viewContainerRef is created, that is cached to this property to prevent creating multiple viewContainerRefs.
   */
  private cachedViewContainerRef?: ViewContainerRef;

  private closeableOverlayRefs: OverlayRef[] = [];

  private mouseUpTimeout: any;

  private readonly eventTimeout: any;

  constructor(private readonly applicationRef: ApplicationRef) {
    this.eventTimeout = setTimeout(() => {
      if (AngularPlatform.isBrowser) {
        window.addEventListener(
          'mousedown',
          (event) => {
            if (event.target instanceof Element) {
              const target = event.target;

              this.openedOverlayRefs.forEach((_overlayRef) => {
                if (!_overlayRef.outsideClosingPrevented && _overlayRef.ready) {
                  const clickableRootNodes: HTMLElement[] =
                    _overlayRef.embeddedViewRef?.rootNodes.filter(
                      (_rootNode) => {
                        return (
                          _rootNode instanceof Element &&
                          getComputedStyle(_rootNode).getPropertyValue(
                            'pointer-events',
                          ) !== 'none' &&
                          _rootNode instanceof HTMLElement &&
                          !_rootNode.classList.contains(
                            'overlay-close-detector',
                          )
                        );
                      },
                    ) || [];

                  // 클릭 가능한 요소 그 어떤 것에도 mousedown 이 일어나지 않았을 경우만 close 가능한 OverlayRef 으로 지정
                  if (
                    clickableRootNodes.every((_node) => !_node.contains(target))
                  ) {
                    this.closeableOverlayRefs.push(_overlayRef);
                  }
                }
              });
            }
          },
          {
            capture: true,
          },
        );

        window.addEventListener(
          'mouseup',
          () => {
            clearTimeout(this.mouseUpTimeout);

            // 마우스를 뗐을 경우 close 가능한 OverlayRef 클리어
            // click 이벤트 감지 이후 실행하기 위해 setTimeout 사용
            this.mouseUpTimeout = setTimeout(() => {
              this.closeableOverlayRefs = [];
            });
          },
          {
            capture: true,
          },
        );

        // close on outside clicking
        window.addEventListener(
          'click',
          (event) => {
            if (event.target instanceof Element) {
              const target = event.target;

              this.openedOverlayRefs.forEach((_overlayRef) => {
                if (!_overlayRef.outsideClosingPrevented && _overlayRef.ready) {
                  const clickableRootNodes: HTMLElement[] =
                    _overlayRef.embeddedViewRef?.rootNodes.filter(
                      (_rootNode) => {
                        return (
                          _rootNode instanceof Element &&
                          getComputedStyle(_rootNode).getPropertyValue(
                            'pointer-events',
                          ) !== 'none' &&
                          _rootNode instanceof HTMLElement &&
                          !_rootNode.classList.contains(
                            'overlay-close-detector',
                          )
                        );
                      },
                    ) || [];

                  if (
                    clickableRootNodes.some((_node) => _node.contains(target))
                  ) {
                    return;
                  } else if (this.closeableOverlayRefs.includes(_overlayRef)) {
                    _overlayRef.close();
                  }
                }
              });
            }
          },
          {
            capture: true,
          },
        );
      }
    });
  }

  /**
   * Get `ViewContainerRef` to render overlays.
   * It creates `OverlayOutletComponent` when there is no outlet in view.
   */
  get viewContainerRef(): ViewContainerRef {
    if (!this.cachedViewContainerRef) {
      const rootViewContainerRef =
        this.applicationRef.components[0].injector.get(ViewContainerRef);
      const overlayOutletRef = rootViewContainerRef.createComponent(
        OverlayOutletComponent,
      );

      overlayOutletRef.changeDetectorRef.detectChanges();

      this.cachedViewContainerRef = overlayOutletRef.instance.viewContainerRef;
    }

    return this.cachedViewContainerRef;
  }

  get hasOpenedOverlay(): boolean {
    return this.openedOverlayRefs.length > 0;
  }

  ngOnDestroy() {
    clearTimeout(this.eventTimeout);
    clearTimeout(this.mouseUpTimeout);
  }

  /**
   * Open a template as overlay.
   * @param templateRef - `TemplateRef` to open as an overlay.
   * @param options - Options to open overlay.
   * @return `EmbeddedViewRef` of rendered `TemplateRef`.
   */
  open<C = any>(
    templateRef: TemplateRef<C>,
    options: OverlayOptions,
  ): OverlayRef<C> {
    // When duplication not allowed, return existing `OverlayRef` if found.
    if (!options?.allowDuplicated) {
      const duplicatedOverlayRef = this.openedOverlayRefs.find(
        (_openedOverlayRef) => _openedOverlayRef.templateRef === templateRef,
      );

      if (duplicatedOverlayRef) {
        return duplicatedOverlayRef;
      }
    }

    // `parentOverlayRef`이 제공될 경우 닫기 방지
    if (options.parentOverlayRef) {
      options.parentOverlayRef.outsideClosingPrevented = true;
      options.parentOverlayRef.keyboardClosingPrevented = true;
    }

    // Create `OverlayRef`.
    const overlayRef: OverlayRef = {
      templateRef,
      keyboardClosingPrevented: !!options?.preventKeyboardClosing,
      outsideClosingPrevented: !!options?.preventOutsideClosing,
      initialKeyboardClosingPrevented: !!options?.preventKeyboardClosing,
      initialOutsideClosingPrevented: !!options?.preventOutsideClosing,
      ready: false,
      close: () => {
        this.close(overlayRef);
      },
      parentOverlayRef: options.parentOverlayRef,
    };

    // Create `EmbeddedView`.
    const embeddedViewRef = this.viewContainerRef.createEmbeddedView(
      templateRef,
      options?.context,
      {
        injector: Injector.create({
          providers: [
            {
              provide: OVERLAY_REF,
              useValue: overlayRef,
            },
          ],
        }),
      },
    );

    overlayRef.embeddedViewRef = embeddedViewRef;

    this.openedOverlayRefs.push(overlayRef);

    embeddedViewRef.onDestroy(() => {
      this.openedOverlayRefs = this.openedOverlayRefs.filter(
        (_openedOverlayRef) =>
          _openedOverlayRef.embeddedViewRef !== embeddedViewRef,
      );

      if (options?.onDestroy) {
        options.onDestroy();
      }

      // `parentOverlayRef`이 제공될 경우 원래 상태로 복원
      if (options.parentOverlayRef) {
        options.parentOverlayRef.outsideClosingPrevented =
          options.parentOverlayRef.initialOutsideClosingPrevented;
        options.parentOverlayRef.keyboardClosingPrevented =
          options.parentOverlayRef.initialKeyboardClosingPrevented;
      }
    });

    // When `destroyRef` provided, destroy overlay when `destroyRef` destroyed.
    if (options?.destroyRef) {
      options.destroyRef.onDestroy(() => {
        overlayRef.close();
      });
    }

    // To prevent closing instantly, set ready status after timeout
    setTimeout(() => (overlayRef.ready = true));

    // Return created `OverlayRef`.
    return overlayRef;
  }

  /** Close latest overlay. It cannot close OverlayRef that has `keyboardClosingPrevented` */
  closeLatest(): void {
    // Filter only closeable OverlayRefs.
    const closeableOverlayRefs = this.openedOverlayRefs.filter(
      (_overlayRef) => !_overlayRef.keyboardClosingPrevented,
    );

    const latestOverlayRef = closeableOverlayRefs.pop();

    // `latestOverlayRef` will be removed from the `openedOverlayRefs` when the `onDestroy()` method run.
    latestOverlayRef?.embeddedViewRef?.destroy();
  }

  /**
   * Close OverlayRef.
   * @param overlayRef - OverlayRef to close.
   */
  close(overlayRef: OverlayRef): void {
    // Destroy rendered `EmbeddedViewRef` of found target.
    overlayRef?.embeddedViewRef?.destroy();

    // Remove `OverlayRef` from the list.
    this.openedOverlayRefs = this.openedOverlayRefs.filter(
      (_overlayRef) => _overlayRef !== overlayRef,
    );
  }
}
