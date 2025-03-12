import { TestBed } from '@angular/core/testing';

import { RadioGroupService } from './radio-group.service';

describe('RadioGroupService', () => {
  let service: RadioGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadioGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
