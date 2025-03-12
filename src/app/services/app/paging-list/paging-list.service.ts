import { DestroyRef, EventEmitter, inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { PagingResult } from '../../../data/paging-result';

@Injectable()
export abstract class PagingListService<Data> {
  fetchLoading$ = new BehaviorSubject(false);

  fetched = new EventEmitter<PagingResult<Data>>();

  fetchFailed = new EventEmitter<HttpErrorResponse>();

  data$ = new BehaviorSubject<Data[]>([]);

  nextCursor$ = new BehaviorSubject<string | undefined>(undefined);

  onceFetched$ = new BehaviorSubject(false);

  protected readonly destroyRef = inject(DestroyRef);

  private cancelFetchEmitter = new EventEmitter<void>();

  get fetchLoading(): boolean {
    return this.fetchLoading$.value;
  }

  set fetchLoading(value: boolean) {
    this.fetchLoading$.next(value);
  }

  get data(): Data[] {
    return this.data$.value;
  }

  set data(value: Data[]) {
    this.data$.next(value);
  }

  get nextCursor(): string | undefined {
    return this.nextCursor$.value;
  }

  set nextCursor(value: string | undefined) {
    this.nextCursor$.next(value);
  }

  get onceFetched(): boolean {
    return this.onceFetched$.value;
  }

  set onceFetched(value: boolean) {
    this.onceFetched$.next(value);
  }

  fetch(...params: any[]): void {
    throw new Error('Fetch method is not implemented');
  }

  protected handleFetchObservable(
    observable: Observable<PagingResult<Data>>,
  ): void {
    if (this.fetchLoading) {
      return;
    }

    this.fetchLoading = true;

    observable
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(takeUntil(this.cancelFetchEmitter))
      .pipe(finalize(() => (this.fetchLoading = false)))
      .subscribe({
        next: (result) => {
          this.data = [...this.data, ...result.data];
          this.nextCursor = result.nextCursor;
          this.onceFetched = true;
          this.fetched.emit(result);
        },
        error: (err: HttpErrorResponse) => this.fetchFailed.emit(err),
      });
  }

  cancelFetch(): void {
    this.cancelFetchEmitter.emit();
  }
}
