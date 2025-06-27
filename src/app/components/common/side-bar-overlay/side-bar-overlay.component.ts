import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import { SideBarPosition } from '../../../types/side-bar-position';
import { spacingToRem } from '../../../utils/tailwind.utils';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-side-bar-overlay',
  imports: [],
  templateUrl: './side-bar-overlay.component.html',
  styleUrl: './side-bar-overlay.component.scss',
  host: {
    '[@sideBarOverlay]': `sideBarOverlayState()`,
    '[class]': `classes()`,
    class: `fixed bg-white dark:bg-dark-background overflow-auto flex flex-col items-stretch w-[calc(100dvw-${spacingToRem(8)}rem)]`,
  },
  animations: [
    trigger('sideBarOverlay', [
      state(
        'void',
        style({
          transform: `{{ translateX }}`,
        }),
      ),
      transition(
        'void => *',
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
export class SideBarOverlayComponent {
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
      'bottom-0': floating,
      'left-0': isLeftPosition && !floating,
      'left-4': isLeftPosition && floating,
      'right-0': isRightPosition && !floating,
      'right-4': isRightPosition && floating,
      'rounded-3xl': floating,
    };
  });

  translateX = computed(() => {
    const position = this.position();

    return position === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
  });

  sideBarOverlayState = computed(() => {
    return {
      value: 'show',
      params: {
        translateX: this.translateX(),
      },
    };
  });

  private readonly overlayRef = inject(OVERLAY_REF);

  close(): void {
    this.overlayRef.close();
  }
}
