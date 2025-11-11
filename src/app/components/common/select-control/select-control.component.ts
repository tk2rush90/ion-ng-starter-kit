import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  effect,
  forwardRef,
  input,
  signal,
  TemplateRef,
} from '@angular/core';
import { SelectControlOptionOverlayComponent } from '../select-control-option-overlay/select-control-option-overlay.component';
import { NgClass } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectControlOptionItemComponent } from '../select-control-option-item/select-control-option-item.component';
import { ChevronDownIcon, LucideAngularModule } from 'lucide-angular';
import { OverlayHandlerWithBackButtonPriorityInherit } from '../../../abstracts/overlay-handler-with-back-button-priority-inherit';
import { OverlayRef } from '../../../services/app/overlay/overlay.service';

export type SelectControlTheme = 'default';

@Component({
  selector: 'app-select-control',
  imports: [SelectControlOptionOverlayComponent, NgClass, LucideAngularModule],
  templateUrl: './select-control.component.html',
  styleUrl: './select-control.component.scss',
  host: {
    class: 'flex flex-col items-stretch',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectControlComponent),
      multi: true,
    },
  ],
})
export class SelectControlComponent
  extends OverlayHandlerWithBackButtonPriorityInherit
  implements ControlValueAccessor
{
  theme = input<SelectControlTheme>('default');

  placeholder = input('');

  isReadOnly = input(false, {
    transform: booleanAttribute,
  });

  selectControlOptionItemComponentList = contentChildren(
    SelectControlOptionItemComponent,
  );

  value = signal<any>(null);

  isDisabled = signal(false);

  isFocused = signal(false);

  classes = computed(() => {
    const theme = this.theme();

    const isReadOnly = this.isReadOnly();

    const isDisabled = this.isDisabled();

    switch (theme) {
      case 'default': {
        return {
          'border-black/30': true,
          'focus:bg-emerald-100': !isReadOnly && !isDisabled,
          'focus:border-transparent': true,
          'bg-neutral-200': isReadOnly || isDisabled,
          'text-neutral-400': isDisabled,
        };
      }
    }
  });

  renderedInnerClasses = computed(() => {
    const theme = this.theme();

    const isFocused = this.isFocused();

    const isDisabled = this.isDisabled();

    switch (theme) {
      case 'default': {
        return {
          'rounded-md': true,
          'border-transparent': !isFocused,
          'border-emerald-500': isFocused && !isDisabled,
          outline: true,
          'outline-1': true,
          'outline-transparent': !isFocused,
          'outline-emerald-500': isFocused && !isDisabled,
        };
      }
    }
  });

  selectedOptionItemComponent = computed(() => {
    const selectControlOptionItemComponentList =
      this.selectControlOptionItemComponentList();

    const value = this.value();

    return selectControlOptionItemComponentList.find(
      (selectControlOptionItemComponent) => {
        return selectControlOptionItemComponent.value() === value;
      },
    );
  });

  selectControlOptionOverlayRef?: OverlayRef;

  onChange = (value: any) => {};

  onTouched = () => {};

  constructor() {
    super();

    effect(() => {
      const selectControlOptionItemComponentList =
        this.selectControlOptionItemComponentList();

      selectControlOptionItemComponentList.forEach(
        (selectControlOptionItemComponent) => {
          selectControlOptionItemComponent.registerClickHandler((value) => {
            this.value.set(value);
            this.onChange(value);
            this.closeSelectControlOption();
          });
        },
      );
    });
  }

  writeValue(obj: any): void {
    this.value.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  openSelectControlOption(templateRef: TemplateRef<any>) {
    if (this.isReadOnly() || this.isDisabled()) {
      return;
    }

    if (!this.selectControlOptionOverlayRef) {
      this.selectControlOptionOverlayRef = this.openOverlay(templateRef, {
        onDestroy: () => {
          setTimeout(() => {
            delete this.selectControlOptionOverlayRef;
          });
        },
      });
    }
  }

  closeSelectControlOption() {
    this.selectControlOptionOverlayRef?.close();
  }

  toggleOptions(templateRef: TemplateRef<any>) {
    if (this.selectControlOptionOverlayRef) {
      this.closeSelectControlOption();
    } else {
      this.openSelectControlOption(templateRef);
    }
  }

  protected readonly ChevronDownIcon = ChevronDownIcon;
}
