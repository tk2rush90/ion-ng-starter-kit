import {
  Component,
  Input,
  makeStateKey,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TransferState,
} from '@angular/core';
import { PagingPostListService } from '../../../services/app/paging-post-list/paging-post-list.service';
import { PagingListDataComponent } from '../../../abstracts/paging-list-data-component';
import { PostItemDto } from '../../../dto/post-item-dto';
import { IntersectionDetectorDirective } from '../../common/intersection-detector/intersection-detector.directive';
import { PostItemComponent } from '../post-item/post-item.component';
import { RouterLink } from '@angular/router';
import { ListDataState } from '../../../data/list-data-state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AngularPlatform } from '../../../utils/platform.utils';

interface PostListDataState
  extends ListDataState<PostItemDto>,
    Pick<PagingPostListService, 'order' | 'wallId'> {}

@Component({
  selector: 'app-post-list',
  imports: [IntersectionDetectorDirective, PostItemComponent, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent
  extends PagingListDataComponent<PagingPostListService, PostItemDto>
  implements OnChanges, OnDestroy
{
  @Input() wallId: string | null = null;

  @Input({ required: true }) order: string | null = null;

  postListDataKey = makeStateKey<PostListDataState | null>('postListData');

  constructor(
    private readonly pagingPostListService: PagingPostListService,
    private readonly transferState: TransferState,
  ) {
    super();

    this.service.fetched
      .pipe(takeUntilDestroyed())
      .subscribe((pagingResult) => {
        if (AngularPlatform.isServer) {
          this.postListData = {
            data: pagingResult.data,
            nextCursor: pagingResult.nextCursor,
            onceFetched: true,
            order: this.service.order,
            wallId: this.service.wallId,
          };
        }
      });

    if (AngularPlatform.isBrowser && this.postListData) {
      this.service.wallId = this.postListData.wallId;
      this.service.order = this.postListData.order;
      this.service.data = this.postListData.data;
      this.service.nextCursor = this.postListData.nextCursor;
      this.service.onceFetched = this.postListData.onceFetched;
    }
  }

  override get service(): PagingPostListService {
    return this.pagingPostListService;
  }

  get postListData(): PostListDataState | null {
    return this.transferState.get(this.postListDataKey, null);
  }

  set postListData(value: PostListDataState | null) {
    this.transferState.set(this.postListDataKey, value);
  }

  ngOnChanges(changes: SimpleChanges) {
    const { wallId: wallIdChange, order: orderChange } = changes;

    let fetchRequired = false;

    if (wallIdChange && wallIdChange.currentValue !== this.service.wallId) {
      this.service.wallId = wallIdChange.currentValue;

      fetchRequired = true;
    }

    if (
      orderChange &&
      (orderChange.currentValue || 'latest') !== this.service.order
    ) {
      this.service.order = orderChange.currentValue || 'latest';

      fetchRequired = true;
    }

    if (fetchRequired) {
      this.service.onceFetched = false;
      this.service.nextCursor = undefined;
      this.service.data = [];
    }

    if (!this.onceFetched) {
      this.fetch();
    }
  }

  ngOnDestroy() {
    if (AngularPlatform.isBrowser) {
      this.transferState.remove(this.postListDataKey);
    }
  }
}
