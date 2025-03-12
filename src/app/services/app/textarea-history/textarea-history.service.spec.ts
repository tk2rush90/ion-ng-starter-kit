import { TestBed } from '@angular/core/testing';

import { TextareaHistoryService } from './textarea-history.service';

describe('TextareaHistoryService', () => {
  let service: TextareaHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextareaHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
