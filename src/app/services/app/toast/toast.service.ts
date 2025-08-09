import {
  ApplicationRef,
  ComponentRef,
  DestroyRef,
  inject,
  Injectable,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { ToastOutletComponent } from '../../../components/common/toast-outlet/toast-outlet.component';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VariableColors } from '../../../utils/tailwind.utils';
import { LucideIconData } from 'lucide-angular';

/** An interface of toast message */
export interface ToastMessage {
  /** Message to display */
  message: string;

  /** 하단에 표시될 작은 설명 */
  description: string;

  theme: VariableColors;

  icon?: LucideIconData;

  /** Duration in milliseconds until auto close */
  duration: number;

  /** Timeout timer assigned to toast message */
  timeout: any;

  /** Close toast method */
  close: () => void;
}

export interface ToastOptions {
  message: string;
  description?: string;
  duration?: number;
  icon?: LucideIconData;
  theme?: VariableColors;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService implements OnDestroy {
  /** Opened toasts */
  toasts: ToastMessage[] = [];

  /** Rendered ToastOutletComponent */
  private toastOutletRef?: ComponentRef<ToastOutletComponent>;

  private readonly renderTimeout: any;

  private readonly destroyRef = inject(DestroyRef);

  private readonly applicationRef = inject(ApplicationRef);

  private readonly translateService = inject(TranslateService);

  constructor() {
    // 앱 초기 렌더링 대기
    this.renderTimeout = setTimeout(() => {
      if (!this.toastOutletRef) {
        const rootViewContainerRef =
          this.applicationRef.components[0].injector.get(ViewContainerRef);
        this.toastOutletRef =
          rootViewContainerRef.createComponent(ToastOutletComponent);

        this.toastOutletRef.changeDetectorRef.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    clearTimeout(this.renderTimeout);
  }

  open({
    message,
    duration = Infinity,
    theme = 'blue',
    description = '',
    icon,
  }: ToastOptions): ToastMessage {
    // Create ToastMessage.
    const toastMessage: ToastMessage = {
      theme,
      description,
      icon,
      message,
      duration,
      timeout:
        duration === Infinity
          ? undefined
          : setTimeout(() => {
              this.close(toastMessage);
            }, duration),
      close: () => {
        this.close(toastMessage);
      },
    };

    this.toasts.push(toastMessage);

    return toastMessage;
  }

  /** ngx-translate 패키지를 이용한 번역본 Toast로 표시 */
  openTranslated({
    message,
    duration = Infinity,
    theme = 'blue',
    description = '',
    icon,
  }: ToastOptions): Promise<ToastMessage> {
    return new Promise((resolve) => {
      this.translateService
        .get(message)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((translatedMessage) => {
          const toastMessage = this.open({
            message: translatedMessage,
            duration,
            theme,
            description,
            icon,
          });

          resolve(toastMessage);
        });
    });
  }

  /** Close toast message. */
  close(toastToClose: ToastMessage): void {
    this.toasts = this.toasts.filter((toast) => {
      if (toast === toastToClose) {
        clearTimeout(toastToClose.timeout);

        return false;
      } else {
        return true;
      }
    });
  }
}
