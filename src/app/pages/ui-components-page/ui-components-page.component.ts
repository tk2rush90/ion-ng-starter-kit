import {
  Component,
  DestroyRef,
  inject,
  signal,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { IconAppressoSymbolComponent } from '../../components/icons/icon-appresso-symbol/icon-appresso-symbol.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { IconButtonDirective } from '../../components/common/icon-button/icon-button.directive';
import {
  LucideAngularModule,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
} from 'lucide-angular';
import { AngularPlatform } from '../../utils/platform.utils';
import { SideBarOverlayComponent } from '../../components/common/side-bar-overlay/side-bar-overlay.component';
import {
  OverlayRef,
  OverlayService,
} from '../../services/app/overlay/overlay.service';

@Component({
  selector: 'app-ui-components-page',
  imports: [
    IconAppressoSymbolComponent,
    RouterLink,
    RouterLinkActive,
    NgClass,
    RouterOutlet,
    IconButtonDirective,
    LucideAngularModule,
    SideBarOverlayComponent,
  ],
  templateUrl: './ui-components-page.component.html',
  styleUrl: './ui-components-page.component.scss',
  host: {
    '(window:resize)': `onWindowResize()`,
  },
  encapsulation: ViewEncapsulation.None,
})
export class UiComponentsPageComponent {
  routes = [
    {
      routerLink: ['/ui/components/autoFocus'],
      label: 'Auto Focus',
    },
    {
      routerLink: ['/ui/components/autoResizer'],
      label: 'Auto Resizer',
    },
    {
      routerLink: ['/ui/components/bottomActions'],
      label: 'Bottom Actions',
    },
    {
      routerLink: ['/ui/components/bottomSheet'],
      label: 'Bottom Sheet',
    },
    {
      routerLink: ['/ui/components/button'],
      label: 'Button',
    },
    {
      routerLink: ['/ui/components/calendar'],
      label: 'Calendar',
    },
    {
      routerLink: ['/ui/components/card'],
      label: 'Card',
    },
    {
      routerLink: ['/ui/components/checkbox'],
      label: 'Checkbox',
    },
    {
      routerLink: ['/ui/components/chip'],
      label: 'Chip',
    },
    {
      routerLink: ['/ui/components/field'],
      label: 'Field',
    },
    {
      routerLink: ['/ui/components/fileHandler'],
      label: 'File Handler',
    },
    {
      routerLink: ['/ui/components/flatButton'],
      label: 'Flat Button',
    },
    {
      routerLink: ['/ui/components/formField'],
      label: 'Form Field',
    },
    {
      routerLink: ['/ui/components/iconButton'],
      label: 'Icon Button',
    },
    {
      routerLink: ['/ui/components/image'],
      label: 'Image',
    },
    {
      routerLink: ['/ui/components/imageHandler'],
      label: 'Image Handler',
    },
    {
      routerLink: ['/ui/components/imeInput'],
      label: 'IME Input',
    },
    {
      routerLink: ['/ui/components/intersectionDetector'],
      label: 'Intersection Detector',
    },
    {
      routerLink: ['/ui/components/messageOverlay'],
      label: 'Message Overlay',
    },
    {
      routerLink: ['/ui/components/modal'],
      label: 'Modal',
    },
    {
      routerLink: ['/ui/components/radioGroup'],
      label: 'Radio Group',
    },
    {
      routerLink: ['/ui/components/sideBar'],
      label: 'Side Bar',
    },
    {
      routerLink: ['/ui/components/sideBarOverlay'],
      label: 'Side Bar Overlay',
    },
    {
      routerLink: ['/ui/components/spinner'],
      label: 'Spinner',
    },
    {
      routerLink: ['/ui/components/tab'],
      label: 'Tab',
    },
    {
      routerLink: ['/ui/components/toast'],
      label: 'Toast',
    },
    {
      routerLink: ['/ui/components/wysiwygEditor'],
      label: 'Wysiwyg Editor',
    },
  ];

  sideBarOverlap = signal(false);

  sideBarOverlayTemplateRef = viewChild<TemplateRef<any>>('sideBarOverlay');

  sideBarOverlayRef?: OverlayRef;

  sideBarOpened = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  private readonly overlayService = inject(OverlayService);

  constructor() {
    this.onWindowResize();
  }

  onWindowResize(): void {
    if (AngularPlatform.isBrowser) {
      this.sideBarOverlap.set(window.innerWidth < 768);
    }
  }

  openSideBarOverlay(): void {
    const sideBarOverlayTemplateRef = this.sideBarOverlayTemplateRef();

    if (sideBarOverlayTemplateRef) {
      this.sideBarOpened.set(true);

      this.sideBarOverlayRef = this.overlayService.open(
        sideBarOverlayTemplateRef,
        {
          destroyRef: this.destroyRef,
          onDestroy: () => {
            this.sideBarOpened.set(false);

            delete this.sideBarOverlayRef;
          },
        },
      );
    }
  }

  closeSideBarOverlay(): void {
    this.sideBarOverlayRef?.close();
  }

  protected readonly PanelRightCloseIcon = PanelRightCloseIcon;
  protected readonly PanelRightOpenIcon = PanelRightOpenIcon;
}
