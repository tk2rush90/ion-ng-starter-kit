import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconKakaoSymbolComponent } from './icon-kakao-symbol.component';

describe('IconKakaoComponent', () => {
  let component: IconKakaoSymbolComponent;
  let fixture: ComponentFixture<IconKakaoSymbolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconKakaoSymbolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconKakaoSymbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
