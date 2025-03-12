import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleOauthButtonComponent } from './google-oauth-button.component';

describe('GoogleOauthButtonComponent', () => {
  let component: GoogleOauthButtonComponent;
  let fixture: ComponentFixture<GoogleOauthButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleOauthButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleOauthButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
