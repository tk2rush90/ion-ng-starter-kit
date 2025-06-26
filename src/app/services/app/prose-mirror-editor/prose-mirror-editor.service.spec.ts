import { TestBed } from '@angular/core/testing';

import { ProseMirrorEditorService } from './prose-mirror-editor.service';

describe('ProseMirrorEditorService', () => {
  let service: ProseMirrorEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProseMirrorEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
