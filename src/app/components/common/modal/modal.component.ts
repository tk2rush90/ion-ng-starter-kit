import {
  AfterViewInit,
  booleanAttribute,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
} from '@angular/core';
import { OverlayRef } from '../../../services/app/overlay/overlay.service';
import { IconXMarkComponent } from '../../icons/icon-x-mark/icon-x-mark.component';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';

/** A modal container */
@Component({
  selector: 'app-modal',
  imports: [IconXMarkComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  host: {
    // Angular 애니메이션 중 transform 속성에 영향을 미치는 애니메이션 정상적으로 표시하기 위함
    '[style.translate]': `'-50% -50%'`,
  },
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  /** Set modal title */
  @Input() modalTitle = '';

  /** Set to display close button */
  @Input({ transform: booleanAttribute }) displayClose = false;

  isScrolled = false;

  private scrollDetectTimeout: any;

  constructor(
    @Inject(OVERLAY_REF) private readonly overlayRef: OverlayRef,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  ngAfterViewInit() {
    this.scrollDetectTimeout = setTimeout(() => this.detectScroll());
  }

  ngOnDestroy() {
    clearTimeout(this.scrollDetectTimeout);
  }

  @HostListener('scroll')
  detectScroll(): void {
    this.isScrolled = this.elementRef.nativeElement.scrollTop > 0;
  }

  /** Close modal */
  close(): void {
    this.overlayRef.close();
  }
}
