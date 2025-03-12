import { DestroyRef, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { FileApiService } from '../../api/file-api/file-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class FileUploadService {
  uploadLoading$ = new BehaviorSubject(false);

  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly fileApiService: FileApiService,
  ) {}

  get uploadLoading(): boolean {
    return this.uploadLoading$.value;
  }

  set uploadLoading(value: boolean) {
    this.uploadLoading$.next(value);
  }

  upload(file: File, width?: number): Observable<string> | undefined;
  upload(files: File[], width?: number): Observable<string[]> | undefined;
  upload(
    fileOrFiles: File | File[],
    width?: number,
  ): Observable<string | string[]> | undefined {
    if (this.uploadLoading) {
      return;
    }

    this.uploadLoading = true;

    return this.fileApiService
      .upload(fileOrFiles, width)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(finalize(() => (this.uploadLoading = false)));
  }
}
