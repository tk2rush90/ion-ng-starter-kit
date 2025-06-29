import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconGoogleSymbolComponent } from './icon-google-symbol.component';

describe('IconGoogleLogoComponent', () => {
  let component: IconGoogleSymbolComponent;
  let fixture: ComponentFixture<IconGoogleSymbolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconGoogleSymbolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconGoogleSymbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
