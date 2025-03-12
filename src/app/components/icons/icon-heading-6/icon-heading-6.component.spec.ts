import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHeading6Component } from './icon-heading-6.component';

describe('IconHeading6Component', () => {
  let component: IconHeading6Component;
  let fixture: ComponentFixture<IconHeading6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHeading6Component],
    }).compileComponents();

    fixture = TestBed.createComponent(IconHeading6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
