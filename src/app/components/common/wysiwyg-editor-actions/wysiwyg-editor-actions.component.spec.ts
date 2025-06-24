import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WysiwygEditorActionsComponent } from './wysiwyg-editor-actions.component';

describe('WysiwygEditorActionsComponent', () => {
  let component: WysiwygEditorActionsComponent;
  let fixture: ComponentFixture<WysiwygEditorActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WysiwygEditorActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WysiwygEditorActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
