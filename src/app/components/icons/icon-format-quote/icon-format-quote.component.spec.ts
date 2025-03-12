import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconFormatQuoteComponent } from './icon-format-quote.component';

describe('IconFormatQuoteComponent', () => {
  let component: IconFormatQuoteComponent;
  let fixture: ComponentFixture<IconFormatQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconFormatQuoteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconFormatQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
