import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconAppressoFullComponent } from './icon-appresso-full.component';

describe('IconLogoFullComponent', () => {
  let component: IconAppressoFullComponent;
  let fixture: ComponentFixture<IconAppressoFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconAppressoFullComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconAppressoFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
