import {
  ApplicationRef,
  ComponentRef,
  DestroyRef,
  Injectable,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { ToastOutletComponent } from '../../../components/common/toast-outlet/toast-outlet.component';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/** An interface of toast message */
export interface ToastMessage {
  /** Message to display */
  message: string;

  /** Duration in milliseconds until auto close */
  duration: number;

  /** Timeout timer assigned to toast message */
  timeout: any;

  /** Close toast method */
  close: () => void;
}

export interface ToastOptions {
  message: string;
  duration?: number;
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

  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly applicationRef: ApplicationRef,
    private readonly translateService: TranslateService,
  ) {
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

  /**
   * Open a new toast message.
   * @param message - Message to display.
   * @param duration - Duration in milliseconds until auto close.
   */
  open({ message, duration = 3000 }: ToastOptions): ToastMessage {
    // Create ToastMessage.
    const toastMessage: ToastMessage = {
      message,
      duration,
      timeout: setTimeout(() => {
        this.close(toastMessage);
      }, duration),
      close: () => {
        this.close(toastMessage);
      },
    };

    this.toasts.push(toastMessage);

    return toastMessage;
  }

  /**
   * ngx-translate 패키지를 이용한 번역본 Toast로 표시
   * @param message - translateKey 사용
   * @param duration
   */
  openTranslated({
    message,
    duration = 3000,
  }: ToastOptions): Promise<ToastMessage> {
    return new Promise((resolve) => {
      this.translateService
        .get(message)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((translatedMessage) => {
          const toastMessage = this.open({
            message: translatedMessage,
            duration,
          });

          resolve(toastMessage);
        });
    });
  }

  /**
   * Close toast message.
   * @param toast - Toast to close.
   */
  close(toast: ToastMessage): void {
    this.toasts = this.toasts.filter((_toast) => _toast !== toast);
  }
}
