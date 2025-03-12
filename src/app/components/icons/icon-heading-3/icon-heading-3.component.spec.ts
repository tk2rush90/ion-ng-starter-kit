import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHeading3Component } from './icon-heading-3.component';

describe('IconHeading3Component', () => {
  let component: IconHeading3Component;
  let fixture: ComponentFixture<IconHeading3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHeading3Component],
    }).compileComponents();

    fixture = TestBed.createComponent(IconHeading3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
