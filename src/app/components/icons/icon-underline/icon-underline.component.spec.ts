import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconUnderlineComponent } from './icon-underline.component';

describe('IconUnderlineComponent', () => {
  let component: IconUnderlineComponent;
  let fixture: ComponentFixture<IconUnderlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconUnderlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconUnderlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
