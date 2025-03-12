import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconFormatStrikethroughComponent } from './icon-format-strikethrough.component';

describe('IconFormatStrikethroughComponent', () => {
  let component: IconFormatStrikethroughComponent;
  let fixture: ComponentFixture<IconFormatStrikethroughComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconFormatStrikethroughComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconFormatStrikethroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
