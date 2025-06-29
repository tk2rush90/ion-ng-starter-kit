import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCalendarPageComponent } from './c-calendar-page.component';

describe('CCalendarPageComponent', () => {
  let component: CCalendarPageComponent;
  let fixture: ComponentFixture<CCalendarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CCalendarPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CCalendarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
