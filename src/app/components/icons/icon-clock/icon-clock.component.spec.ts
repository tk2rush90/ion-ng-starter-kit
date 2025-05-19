import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconClockComponent } from './icon-clock.component';

describe('IconClockComponent', () => {
  let component: IconClockComponent;
  let fixture: ComponentFixture<IconClockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconClockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
