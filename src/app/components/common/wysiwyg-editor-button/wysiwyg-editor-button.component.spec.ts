import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WysiwygEditorButtonComponent } from './wysiwyg-editor-button.component';

describe('WysiwygEditorButtonComponent', () => {
  let component: WysiwygEditorButtonComponent;
  let fixture: ComponentFixture<WysiwygEditorButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WysiwygEditorButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WysiwygEditorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
