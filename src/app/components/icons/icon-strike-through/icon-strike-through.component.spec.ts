import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconStrikeThroughComponent } from './icon-strike-through.component';

describe('IconStrikeThroughComponent', () => {
  let component: IconStrikeThroughComponent;
  let fixture: ComponentFixture<IconStrikeThroughComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconStrikeThroughComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconStrikeThroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
