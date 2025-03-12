import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHeading2Component } from './icon-heading-2.component';

describe('IconHeading2Component', () => {
  let component: IconHeading2Component;
  let fixture: ComponentFixture<IconHeading2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHeading2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(IconHeading2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
