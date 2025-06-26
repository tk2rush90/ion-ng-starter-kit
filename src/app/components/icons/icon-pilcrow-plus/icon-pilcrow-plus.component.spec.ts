import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconPilcrowPlusComponent } from './icon-pilcrow-plus.component';

describe('IconPilcrowPlusComponent', () => {
  let component: IconPilcrowPlusComponent;
  let fixture: ComponentFixture<IconPilcrowPlusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconPilcrowPlusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconPilcrowPlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
