import {
  AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  contentChild,
  input,
  signal,
} from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-side-bar-container',
  imports: [NgStyle],
  templateUrl: './side-bar-container.component.html',
  styleUrl: './side-bar-container.component.scss',
  host: {
    class: 'relative flex items-stretch flex-row',
  },
})
export class SideBarContainerComponent implements AfterViewInit {
  /** 초기 열림 상태 설정. 기본적으로 사이드바는 닫힘 상태. 컴포넌트 뷰 초기화 시만 적용 가능 */
  opened = input(false, {
    transform: booleanAttribute,
  });

  isOpened = signal(false);

  sideBarComponent = contentChild(SideBarComponent);

  contentStyles = computed(() => {
    const isOpened = this.isOpened();

    const sideBarComponent = this.sideBarComponent();

    if (sideBarComponent) {
      const sidebarWidth = sideBarComponent.domRect()?.width || 0;

      const keepSize = sideBarComponent.keepSize();

      const overlapContent = sideBarComponent.overlapContent();

      const maxWidthOpened = `calc(100% - ${sidebarWidth}px)`;

      const maxWidthClosed = keepSize ? `calc(100% - ${keepSize})` : null;

      return {
        maxWidth: !overlapContent && isOpened ? maxWidthOpened : maxWidthClosed,
      };
    } else {
      return {};
    }
  });

  ngAfterViewInit() {
    if (this.opened()) {
      this.isOpened.set(true);
    }
  }
}
