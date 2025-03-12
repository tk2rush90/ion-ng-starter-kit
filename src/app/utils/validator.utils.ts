import { ValidatorFn } from '@angular/forms';

export const advancedRequired: ValidatorFn = (control) => {
  const value = control.value;

  if (!value || String(value).trim() === '') {
    return {
      required: true,
    };
  }

  return null;
};

export const advancedEmail: ValidatorFn = (control) => {
  if (control.value) {
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/[Symbol.match](
        control.value,
      )
    ) {
      return {
        email: true,
      };
    }
  }

  return null;
};

export const spaceless: ValidatorFn = (control) => {
  if (control.value) {
    if ((control.value as string).search(/\s/g) !== -1) {
      return {
        spaceless: true,
      };
    }
  }

  return null;
};

export const completedCharacter: ValidatorFn = (control) => {
  if (control.value) {
    if ((control.value as string).search(/[ㄱ-ㅎㅏ-ㅣ]/g) !== -1) {
      return {
        completedCharacter: true,
      };
    }
  }

  return null;
};

export const normalCharacter: ValidatorFn = (control) => {
  if (control.value) {
    if (control.value.search(/[^가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ ]/g) !== -1) {
      return {
        normalCharacter: true,
      };
    }
  }

  return null;
};
