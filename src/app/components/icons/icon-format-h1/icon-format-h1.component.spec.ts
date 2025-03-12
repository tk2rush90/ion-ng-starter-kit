import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconFormatH1Component } from './icon-format-h1.component';

describe('IconH1Component', () => {
  let component: IconFormatH1Component;
  let fixture: ComponentFixture<IconFormatH1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconFormatH1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(IconFormatH1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
