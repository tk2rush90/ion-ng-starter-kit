import {
  DestroyRef,
  EventEmitter,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { finalize, Observable, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { PagingResultDto } from '../../../dto/paging-result-dto';

@Injectable()
export abstract class PagingListService<Data> {
  fetchLoading = signal(false);

  fetched = new EventEmitter<PagingResultDto<Data>>();

  fetchFailed = new EventEmitter<HttpErrorResponse>();

  data = signal<Data[]>([]);

  nextCursor: WritableSignal<string | undefined> = signal<string | undefined>(
    undefined,
  );

  onceFetched = signal(false);

  protected readonly destroyRef = inject(DestroyRef);

  private cancelFetchEmitter = new EventEmitter<void>();

  fetch(...params: any[]): void {
    throw new Error('Fetch method is not implemented');
  }

  protected handleFetchObservable(
    observable: Observable<PagingResultDto<Data>>,
  ): void {
    if (this.fetchLoading()) {
      return;
    }

    this.fetchLoading.set(true);

    observable
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(takeUntil(this.cancelFetchEmitter))
      .pipe(finalize(() => this.fetchLoading.set(false)))
      .subscribe({
        next: (result) => {
          this.data.update((data) => [...data, ...result.data]);
          this.nextCursor.set(result.nextCursor);
          this.onceFetched.set(true);
          this.fetched.emit(result);
        },
        error: (err: HttpErrorResponse) => this.fetchFailed.emit(err),
      });
  }

  cancelFetch(): void {
    this.cancelFetchEmitter.emit();
  }
}
