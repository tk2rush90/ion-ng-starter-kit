import { TestBed } from '@angular/core/testing';

import { PagingPostListService } from './paging-post-list.service';

describe('PagingPostListService', () => {
  let service: PagingPostListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagingPostListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
