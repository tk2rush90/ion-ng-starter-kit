import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconChevronDownComponent } from './icon-chevron-down.component';

describe('IconChevronDownComponent', () => {
  let component: IconChevronDownComponent;
  let fixture: ComponentFixture<IconChevronDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconChevronDownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconChevronDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
