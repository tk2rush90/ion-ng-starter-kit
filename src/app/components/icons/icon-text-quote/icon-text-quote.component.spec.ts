import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTextQuoteComponent } from './icon-text-quote.component';

describe('IconTextQuoteComponent', () => {
  let component: IconTextQuoteComponent;
  let fixture: ComponentFixture<IconTextQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconTextQuoteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconTextQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
