import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconFormatListNumberedComponent } from './icon-format-list-numbered.component';

describe('IconFormatListNumberedComponent', () => {
  let component: IconFormatListNumberedComponent;
  let fixture: ComponentFixture<IconFormatListNumberedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconFormatListNumberedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconFormatListNumberedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
