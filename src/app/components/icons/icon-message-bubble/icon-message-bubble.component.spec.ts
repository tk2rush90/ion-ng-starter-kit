import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconMessageBubbleComponent } from './icon-message-bubble.component';

describe('IconMessageBubbleComponent', () => {
  let component: IconMessageBubbleComponent;
  let fixture: ComponentFixture<IconMessageBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconMessageBubbleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconMessageBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
