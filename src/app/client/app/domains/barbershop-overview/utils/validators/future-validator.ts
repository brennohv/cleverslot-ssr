import { AbstractControl, ValidatorFn } from '@angular/forms';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

export function specificDateFormatAndFutureValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const dateValue = control.value;
    if (!dateValue) {
      return null;
    }

    const date = dayjs(dateValue);

    return date.isValid() && date.isSameOrAfter(dayjs(), 'day')
      ? null
      : { invalidDate: { value: control.value } };
  };
}
