import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconFormatH3Component } from './icon-format-h3.component';

describe('IconH3Component', () => {
  let component: IconFormatH3Component;
  let fixture: ComponentFixture<IconFormatH3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconFormatH3Component],
    }).compileComponents();

    fixture = TestBed.createComponent(IconFormatH3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
