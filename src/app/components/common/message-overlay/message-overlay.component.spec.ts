import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageOverlayComponent } from './message-overlay.component';

describe('MessageOverlayComponent', () => {
  let component: MessageOverlayComponent;
  let fixture: ComponentFixture<MessageOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
