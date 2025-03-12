import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHeading1Component } from './icon-heading-1.component';

describe('IconHeading1Component', () => {
  let component: IconHeading1Component;
  let fixture: ComponentFixture<IconHeading1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHeading1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(IconHeading1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
