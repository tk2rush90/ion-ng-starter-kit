import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconAppressoSymbolComponent } from './icon-appresso-symbol.component';

describe('IconLogoSymbolComponent', () => {
  let component: IconAppressoSymbolComponent;
  let fixture: ComponentFixture<IconAppressoSymbolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconAppressoSymbolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconAppressoSymbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
