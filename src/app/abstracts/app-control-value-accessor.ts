import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ElementRef, inject, Renderer2 } from '@angular/core';

/** Abstract class of implementation of `ControlValueAccessor` */
export abstract class AppControlValueAccessor implements ControlValueAccessor {
  /** Disabled status */
  isDisabled = false;

  /** `NgControl` to use from internally */
  private readonly internalNgControl: NgControl | null;

  /** `Renderer2` to use from internally */
  private readonly internalRenderer: Renderer2;

  /** `ElementRef` of host element to use from internally */
  private readonly internalElementRef: ElementRef<HTMLElement>;

  protected constructor() {
    this.internalNgControl = inject(NgControl, { optional: true });
    this.internalRenderer = inject(Renderer2);
    this.internalElementRef = inject(ElementRef);

    if (this.internalNgControl) {
      this.internalNgControl.valueAccessor = this;
    }
  }

  /** OnChange callback from the `NgControl`. When value updated, call this method */
  onChange = (value: any) => {};

  /** OnTouched callback from the `NgControl`. When marking control as touched, call this method */
  onTouched = () => {};

  /** Write value to a component */
  abstract writeValue(obj: any): void;

  /** Register `onChange` callback */
  registerOnChange(fn = (value: any) => {}): void {
    this.onChange = fn;
  }

  /** Register `onTouched` callback */
  registerOnTouched(fn = () => {}): void {
    this.onTouched = fn;
  }

  /**
   * Set disabled status to a component. It toggles `disabled` attribute to host element.
   * The `disabled` attribute may be accessible only with `[disabled]` selector from the CSS instead of `:disabled`.
   */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;

    if (isDisabled) {
      this.setAttribute('disabled');
    } else {
      this.removeAttribute('disabled');
    }
  }

  /** Call to update value for both NgControl and component */
  updateValue(value: any): void {
    this.onChange(value);
    this.writeValue(value);
  }

  /** Set attribute with empty value to host element */
  private setAttribute(name: string): void {
    this.internalRenderer.setAttribute(
      this.internalElementRef.nativeElement,
      name,
      '',
    );
  }

  /** Remove attribute from the host element */
  private removeAttribute(name: string): void {
    this.internalRenderer.removeAttribute(
      this.internalElementRef.nativeElement,
      name,
    );
  }
}
