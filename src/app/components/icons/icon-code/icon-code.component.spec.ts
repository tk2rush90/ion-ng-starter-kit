import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCodeComponent } from './icon-code.component';

describe('IconCodeComponent', () => {
  let component: IconCodeComponent;
  let fixture: ComponentFixture<IconCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconCodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
