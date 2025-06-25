import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarOverlayComponent } from './calendar-overlay.component';

describe('InputCalendarComponent', () => {
  let component: CalendarOverlayComponent;
  let fixture: ComponentFixture<CalendarOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarOverlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
