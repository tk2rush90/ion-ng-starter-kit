import { Injectable } from '@angular/core';
import { PagingListService } from '../paging-list/paging-list.service';
import { PostItemDto } from '../../../dto/post-item-dto';
import { BehaviorSubject } from 'rxjs';

/** 게시글 목록 조회 서비스. 하나의 서비스로 홈, 담벼락 모두 관리 */
@Injectable({
  providedIn: 'root',
})
export class PagingPostListService extends PagingListService<PostItemDto> {
  order$ = new BehaviorSubject('latest');

  wallId$ = new BehaviorSubject<string | null>(null);

  constructor() {
    super();
  }

  get order(): string {
    return this.order$.value;
  }

  set order(value: string) {
    this.order$.next(value);
  }

  get wallId(): string | null {
    return this.wallId$.value;
  }

  set wallId(value: string | null) {
    this.wallId$.next(value);
  }
}
