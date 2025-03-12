import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHeading5Component } from './icon-heading-5.component';

describe('IconHeading5Component', () => {
  let component: IconHeading5Component;
  let fixture: ComponentFixture<IconHeading5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHeading5Component],
    }).compileComponents();

    fixture = TestBed.createComponent(IconHeading5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
