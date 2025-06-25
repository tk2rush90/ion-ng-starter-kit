import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FileErrorData } from '../../../data/file-error-data';
import { FileValidateResultData } from '../../../data/file-validate-result-data';

@Directive({
  selector: 'input[type="file"][appFileHandler]',
  standalone: true,
})
export class FileHandlerDirective implements OnInit {
  accept = input<string>('');

  limit = input<number | null>(null);

  fileChange = output<File>();

  filesChange = output<File[]>();

  fileError = output<FileErrorData>();

  private isMultiple = signal(false);

  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  ngOnInit(): void {
    this.isMultiple.set(this.elementRef.nativeElement.multiple);
  }

  @HostListener('change', ['$event'])
  handleFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;

    if (!files || files.length === 0) {
      return;
    }

    const validFiles: File[] = [];

    const results = Array.from(files).map((file) => this.validateFile(file));

    results.forEach((result) => {
      if (result.isValid) {
        validFiles.push(result.file);
      } else {
        this.fileError.emit({
          file: result.file,
          message: result.errorMessage!,
        });
      }
    });

    if (validFiles.length > 0) {
      if (this.isMultiple()) {
        this.filesChange.emit(validFiles);
      } else if (validFiles.length > 0) {
        this.fileChange.emit(validFiles[0]);
      }
    }

    // input 요소의 값 초기화 (동일 파일 재선택 시 change 이벤트 발생 위함)
    inputElement.value = '';
  }

  private validateFile(file: File): FileValidateResultData {
    const currentAccept = this.accept();

    if (currentAccept) {
      const acceptedMimeTypes = currentAccept
        .split(',')
        .map((type) => type.trim());

      const fileMimeType = file.type || 'application/octet-stream';

      const isMimeTypeValid = acceptedMimeTypes.some((acceptedType) => {
        if (acceptedType.endsWith('/*')) {
          const baseType = acceptedType.slice(0, -2);
          return fileMimeType.startsWith(baseType + '/');
        }

        return fileMimeType === acceptedType;
      });

      if (!isMimeTypeValid) {
        return {
          isValid: false,
          file,
          errorMessage: `파일 "${file.name}"은 허용되지 않는 형식입니다.`,
        };
      }
    }

    const currentLimit = this.limit();

    if (currentLimit !== null && file.size > currentLimit) {
      return {
        isValid: false,
        file,
        errorMessage: `파일 "${file.name}"의 용량이 제한 용량을 초과합니다.`,
      };
    }

    return { isValid: true, file };
  }
}
