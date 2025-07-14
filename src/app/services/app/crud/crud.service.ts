import {
  DestroyRef,
  EventEmitter,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { finalize, Observable, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export abstract class CrudService<
  Data,
  C = Data,
  R = Data,
  U = Data,
  D = Data,
> {
  createLoading = signal(false);

  created = new EventEmitter<C>();

  createFailed = new EventEmitter<HttpErrorResponse>();

  fetchLoading = signal(false);

  fetched = new EventEmitter<R>();

  fetchFailed = new EventEmitter<HttpErrorResponse>();

  updateLoading = signal(false);

  updated = new EventEmitter<U>();

  updateFailed = new EventEmitter<HttpErrorResponse>();

  deleteLoading = signal(false);

  deleted = new EventEmitter<D>();

  deleteFailed = new EventEmitter<HttpErrorResponse>();

  data: WritableSignal<R | null> = signal<R | null>(null);

  onceFetched = signal(false);

  private cancelCreateEmitter = new EventEmitter<void>();

  private cancelFetchEmitter = new EventEmitter<void>();

  private cancelUpdateEmitter = new EventEmitter<void>();

  private cancelDeleteEmitter = new EventEmitter<void>();

  protected readonly destroyRef = inject(DestroyRef);

  /** POST 요청 처리 */
  create(...params: any[]): void {
    throw new Error('Create method is not implemented');
  }

  /** GET 요청 처리 */
  fetch(...params: any[]): void {
    throw new Error('Fetch method is not implemented');
  }

  /** PUT 요청 처리 */
  update(...params: any[]): void {
    throw new Error('Update method is not implemented');
  }

  /** DELETE 요청 처리 */
  delete(...params: any[]): void {
    throw new Error('Delete method is not implemented');
  }

  protected handleCreateObservable(observable: Observable<C>): void {
    if (this.createLoading()) {
      return;
    }

    this.createLoading.set(true);

    observable
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(takeUntil(this.cancelCreateEmitter))
      .pipe(finalize(() => this.createLoading.set(false)))
      .subscribe({
        next: (data) => this.created.emit(data),
        error: (err: HttpErrorResponse) => this.createFailed.emit(err),
      });
  }

  protected handleFetchObservable(observable: Observable<R>): void {
    if (this.fetchLoading()) {
      return;
    }

    this.fetchLoading.set(true);

    observable
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(takeUntil(this.cancelFetchEmitter))
      .pipe(finalize(() => this.fetchLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.data.set(data);
          this.onceFetched.set(true);
          this.fetched.emit(data);
        },
        error: (err: HttpErrorResponse) => this.fetchFailed.emit(err),
      });
  }

  protected handleUpdateObservable(observable: Observable<U>): void {
    if (this.updateLoading()) {
      return;
    }

    this.updateLoading.set(true);

    observable
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(takeUntil(this.cancelUpdateEmitter))
      .pipe(finalize(() => this.updateLoading.set(false)))
      .subscribe({
        next: (data) => this.updated.emit(data),
        error: (err: HttpErrorResponse) => this.updateFailed.emit(err),
      });
  }

  protected handleDeleteObservable(observable: Observable<D>): void {
    if (this.deleteLoading()) {
      return;
    }

    this.deleteLoading.set(true);

    observable
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(takeUntil(this.cancelDeleteEmitter))
      .pipe(finalize(() => this.deleteLoading.set(false)))
      .subscribe({
        next: (data) => this.deleted.emit(data),
        error: (err: HttpErrorResponse) => this.deleteFailed.emit(err),
      });
  }

  cancelCreate(): void {
    this.cancelCreateEmitter.emit();
  }

  cancelFetch(): void {
    this.cancelFetchEmitter.emit();
  }

  cancelUpdate(): void {
    this.cancelUpdateEmitter.emit();
  }

  cancelDelete(): void {
    this.cancelDeleteEmitter.emit();
  }
}
