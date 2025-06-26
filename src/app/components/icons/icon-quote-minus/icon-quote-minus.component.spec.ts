import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconQuoteMinusComponent } from './icon-quote-minus.component';

describe('IconQuoteMinusComponent', () => {
  let component: IconQuoteMinusComponent;
  let fixture: ComponentFixture<IconQuoteMinusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconQuoteMinusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconQuoteMinusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
