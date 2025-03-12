import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconBoldComponent } from './icon-bold.component';

describe('IconBoldComponent', () => {
  let component: IconBoldComponent;
  let fixture: ComponentFixture<IconBoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconBoldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconBoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
