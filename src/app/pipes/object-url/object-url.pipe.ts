import { Pipe, PipeTransform } from '@angular/core';

/** Pipe to create object url from the File */
@Pipe({
  name: 'objectUrl',
  standalone: true,
})
export class ObjectUrlPipe implements PipeTransform {
  transform(file?: File): string {
    return file ? URL.createObjectURL(file) : '';
  }
}
