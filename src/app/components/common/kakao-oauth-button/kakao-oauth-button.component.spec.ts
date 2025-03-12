import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KakaoOauthButtonComponent } from './kakao-oauth-button.component';

describe('KakaoOauthButtonComponent', () => {
  let component: KakaoOauthButtonComponent;
  let fixture: ComponentFixture<KakaoOauthButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KakaoOauthButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KakaoOauthButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
