import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCircleHelpComponent } from './icon-circle-help.component';

describe('IconCircleHelpComponent', () => {
  let component: IconCircleHelpComponent;
  let fixture: ComponentFixture<IconCircleHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconCircleHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconCircleHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
