import {
  Component,
  DOCUMENT,
  inject,
  PLATFORM_ID,
  Renderer2,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AngularPlatform } from './utils/platform.utils';
import { RouterOutlet } from '@angular/router';
import { Keyboard, KeyboardInfo } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular/standalone';
import { DeviceInsets } from './plugins/device-insets-plugin';
import { Insets } from './data/insets';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [FormsModule, RouterOutlet],
  host: {
    '(window:scroll)': `detectScroll()`,
  },
})
export class AppComponent {
  isInsetsReady = signal(false);

  private readonly platformId = inject(PLATFORM_ID);

  private readonly storage = inject(Storage);

  private readonly platform = inject(Platform);

  private readonly document = inject(DOCUMENT);

  private readonly renderer = inject(Renderer2);

  constructor() {
    AngularPlatform.setPlatformId(this.platformId);

    if (AngularPlatform.isBrowser) {
      this.storage.create();
      this.detectScroll();
    }

    if (this.platform.is('hybrid')) {
      DeviceInsets.getInsets().then((insets) => {
        for (const position in insets) {
          this.document.documentElement.style.setProperty(
            `--inset-${position}`,
            insets[position as keyof Insets] + 'px',
          );
        }

        this.isInsetsReady.set(true);
      });

      // 키보드 높이 변화에 따른 CSS 변수 값 변화
      Keyboard.addListener('keyboardWillShow', (info) =>
        this.onKeyboardShow(info),
      );

      Keyboard.addListener('keyboardDidShow', (info) =>
        this.onKeyboardShow(info),
      );

      Keyboard.addListener('keyboardWillHide', () => this.onKeyboardHide());

      Keyboard.addListener('keyboardDidHide', () => this.onKeyboardHide());
    } else {
      this.initInsets();
      this.onKeyboardHide();

      this.isInsetsReady.set(true);
    }
  }

  detectScroll(): void {
    if (window.scrollY > 0) {
      this.renderer.addClass(this.document.documentElement, 'scrolled');
    } else {
      this.renderer.removeClass(this.document.documentElement, 'scrolled');
    }
  }

  private initInsets(): void {
    const positions = ['top', 'bottom', 'left', 'right'];

    for (const position of positions) {
      this.document.documentElement.style.setProperty(
        `--inset-${position}`,
        '0px',
      );
    }
  }

  private onKeyboardShow(info: KeyboardInfo): void {
    this.document.documentElement.style.setProperty(
      '--keyboard-height',
      info.keyboardHeight + 'px',
    );

    this.renderer.addClass(this.document.documentElement, 'keyboard-opened');
  }

  private onKeyboardHide(): void {
    this.document.documentElement.style.setProperty('--keyboard-height', '0px');

    this.renderer.removeClass(this.document.documentElement, 'keyboard-opened');
  }
}
