import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconKakaoComponent } from './icon-kakao.component';

describe('IconKakaoComponent', () => {
  let component: IconKakaoComponent;
  let fixture: ComponentFixture<IconKakaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconKakaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconKakaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
