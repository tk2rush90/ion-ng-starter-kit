import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconFormatH2Component } from './icon-format-h2.component';

describe('IconH2Component', () => {
  let component: IconFormatH2Component;
  let fixture: ComponentFixture<IconFormatH2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconFormatH2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(IconFormatH2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
