import { TestBed } from '@angular/core/testing';

import { ProseMirrorService } from './prose-mirror.service';

describe('ProseMirrorService', () => {
  let service: ProseMirrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProseMirrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
