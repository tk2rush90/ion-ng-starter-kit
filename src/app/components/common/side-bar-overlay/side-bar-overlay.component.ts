import {
  AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { SideBarPosition } from '../../../types/side-bar-position';
import { spacingToRem } from '../../../utils/tailwind.utils';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';

/** 반드시 외부에서 애니메이션을 바인딩 해줘야 내부 애니메이션의 스코프가 부모 요소로 이동한다. */
@Component({
  selector: 'app-side-bar-overlay',
  imports: [],
  templateUrl: './side-bar-overlay.component.html',
  styleUrl: './side-bar-overlay.component.scss',
  host: {
    '[@sideBarOverlay]': `sideBarOverlayState()`,
    '[class]': `classes()`,
    '[style]': `styles()`,
    class: `fixed bg-background overflow-auto flex flex-col items-stretch pointer-events-auto`,
  },
  animations: [
    trigger('sideBarOverlay', [
      state(
        'void',
        style({
          transform: `{{ translateX }}`,
        }),
        {
          params: {
            translateX: 'translateX(0%)',
          },
        },
      ),
      transition(
        'void => show',
        animate(
          '.15s ease-out',
          style({
            transform: 'translateX(0)',
          }),
        ),
      ),
      transition('* => void', animate('.15s ease-out')),
    ]),
  ],
})
export class SideBarOverlayComponent implements AfterViewInit {
  /** 플로팅 설정 시 오버레이가 화면 바운더리에 붙어있지 않고 떠있는 형태로 렌더링 된다 */
  floating = input(false, {
    transform: booleanAttribute,
  });

  position = input.required<SideBarPosition>();

  classes = computed(() => {
    const position = this.position();

    const isLeftPosition = position === 'left';

    const isRightPosition = position === 'right';

    const floating = this.floating();

    return {
      'top-0': !floating,
      'top-4': floating,
      'bottom-0': !floating,
      'bottom-4': floating,
      'left-0': isLeftPosition && !floating,
      'left-4': isLeftPosition && floating,
      'right-0': isRightPosition && !floating,
      'right-4': isRightPosition && floating,
      'rounded-3xl': floating,
    };
  });

  styles = computed(() => {
    const floating = this.floating();

    return {
      width: `calc(100dvw - ${spacingToRem(floating ? 8 : 4)}rem)`,
    };
  });

  translateX = computed(() => {
    const position = this.position();

    return position === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
  });

  sideBarOverlayState = computed(() => {
    return {
      value: this.isReady() ? 'show' : 'void',
      params: {
        translateX: this.translateX(),
      },
    };
  });

  /**
   * 슬라이드 애니메이션 시 컴포넌트 생성 즉시 애니메이션을 실행하면
   * void 상태의 초기 translateX 값이 제대로 바인딩 되지 않는 문제가 발생.
   * 문제를 해결하기 위해 View가 초기화 되고난 후 이 값을 true로 변경시켜
   * 애니메이션 실행
   */
  isReady = signal(false);

  private readonly overlayRef = inject(OVERLAY_REF);

  ngAfterViewInit() {
    this.isReady.set(true);
  }

  close(): void {
    this.overlayRef.close();
  }
}
