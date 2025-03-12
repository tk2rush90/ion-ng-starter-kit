import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconFormatItalicComponent } from './icon-format-italic.component';

describe('IconFormatItalicComponent', () => {
  let component: IconFormatItalicComponent;
  let fixture: ComponentFixture<IconFormatItalicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconFormatItalicComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconFormatItalicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
