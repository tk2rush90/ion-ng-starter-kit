import { Component, computed, contentChild, signal } from '@angular/core';
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
export class SideBarContainerComponent {
  isOpened = signal(false);

  sideBarComponent = contentChild(SideBarComponent);

  contentStyles = computed(() => {
    const isOpened = this.isOpened();

    const sideBarComponent = this.sideBarComponent();

    if (sideBarComponent) {
      const sidebarWidth = sideBarComponent.domRect()?.width || 0;

      const keepSize = sideBarComponent.keepSize();

      const position = sideBarComponent.position();

      const overlapContent = sideBarComponent.overlapContent();

      const paddingOpened = `${sidebarWidth}px`;

      const paddingClosed = keepSize ?? null;

      return {
        paddingLeft:
          position === 'left'
            ? !overlapContent && isOpened
              ? paddingOpened
              : paddingClosed
            : null,
        paddingRight:
          position === 'right'
            ? !overlapContent && isOpened
              ? paddingOpened
              : paddingClosed
            : null,
      };
    } else {
      return {};
    }
  });
}
