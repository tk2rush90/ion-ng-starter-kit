import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WysiwygYoutubeEmbedComponent } from './wysiwyg-youtube-embed.component';

describe('WysiwygYoutubeEmbedComponent', () => {
  let component: WysiwygYoutubeEmbedComponent;
  let fixture: ComponentFixture<WysiwygYoutubeEmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WysiwygYoutubeEmbedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WysiwygYoutubeEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
