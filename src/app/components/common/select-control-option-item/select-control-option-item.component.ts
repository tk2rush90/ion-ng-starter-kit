import { Component, ElementRef, inject, input } from '@angular/core';

@Component({
  selector: 'app-select-control-option-item',
  imports: [],
  templateUrl: './select-control-option-item.component.html',
  styleUrl: './select-control-option-item.component.scss',
  host: {
    '(click)': `onClick()`,
    class:
      'flex items-center gap-2 px-4 min-h-10 py-1 cursor-pointer hover:bg-neutral-100 transition-all',
  },
})
export class SelectControlOptionItemComponent {
  value = input.required<any>();

  clickHandler = (value: any) => {};

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  get label() {
    return this.elementRef.nativeElement.innerText;
  }

  onClick() {
    this.clickHandler(this.value());
  }

  registerClickHandler(callback: (value: any) => void) {
    this.clickHandler = callback;
  }
}
