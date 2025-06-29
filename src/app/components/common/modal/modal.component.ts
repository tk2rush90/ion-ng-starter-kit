import {
  AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';
import { IconButtonDirective } from '../icon-button/icon-button.directive';
import { LucideAngularModule, XIcon } from 'lucide-angular';
import { NgClass } from '@angular/common';

/** A modal container */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  host: {
    '(scroll)': `detectScroll()`,
    '[style]': `styles`,
    class:
      'pointer-events-auto fixed left-1/2 top-1/2 flex max-h-[calc(100dvh-32px)] w-[calc(100dvw-32px)] flex-col items-stretch overflow-auto rounded-3xl bg-background shadow-2xl',
  },
  imports: [IconButtonDirective, LucideAngularModule, NgClass],
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  modalTitle = input<string>('');

  displayCloseButton = input(false, { transform: booleanAttribute });

  isScrolled = signal(false);

  scrollClasses = computed(() => {
    const isScrolled = this.isScrolled();

    return {
      'shadow-lg': isScrolled,
    };
  });

  styles = {
    translate: '-50% -50%',
  };

  private scrollDetectTimeout: any;

  private readonly overlayRef = inject(OVERLAY_REF);

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  ngAfterViewInit() {
    this.scrollDetectTimeout = setTimeout(() => this.detectScroll());
  }

  ngOnDestroy() {
    clearTimeout(this.scrollDetectTimeout);
  }

  detectScroll(): void {
    this.isScrolled.set(this.elementRef.nativeElement.scrollTop > 0);
  }

  /** Close modal */
  close(): void {
    this.overlayRef.close();
  }

  protected readonly XIcon = XIcon;
}
