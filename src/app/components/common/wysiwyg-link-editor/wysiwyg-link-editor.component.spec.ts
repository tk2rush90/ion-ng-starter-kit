import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WysiwygLinkEditorComponent } from './wysiwyg-link-editor.component';

describe('WysiwygLinkEditorComponent', () => {
  let component: WysiwygLinkEditorComponent;
  let fixture: ComponentFixture<WysiwygLinkEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WysiwygLinkEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WysiwygLinkEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
