import { Component, input, numberAttribute } from '@angular/core';

@Component({
  template: '',
})
export abstract class BackButtonPriorityInherit {
  inheritPriority = input.required({
    transform: numberAttribute,
  });
}
