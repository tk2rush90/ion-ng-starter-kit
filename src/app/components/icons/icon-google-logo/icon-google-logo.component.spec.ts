import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconGoogleLogoComponent } from './icon-google-logo.component';

describe('IconGoogleLogoComponent', () => {
  let component: IconGoogleLogoComponent;
  let fixture: ComponentFixture<IconGoogleLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconGoogleLogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconGoogleLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
