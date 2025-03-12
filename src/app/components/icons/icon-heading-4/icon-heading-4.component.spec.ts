import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHeading4Component } from './icon-heading-4.component';

describe('IconHeading4Component', () => {
  let component: IconHeading4Component;
  let fixture: ComponentFixture<IconHeading4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHeading4Component],
    }).compileComponents();

    fixture = TestBed.createComponent(IconHeading4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
