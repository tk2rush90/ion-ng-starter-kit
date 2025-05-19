import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHouseComponent } from './icon-house.component';

describe('IconHouseComponent', () => {
  let component: IconHouseComponent;
  let fixture: ComponentFixture<IconHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHouseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
