import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconFormatBoldComponent } from './icon-format-bold.component';

describe('IconFormatBoldComponent', () => {
  let component: IconFormatBoldComponent;
  let fixture: ComponentFixture<IconFormatBoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconFormatBoldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconFormatBoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
