import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayActionsComponent } from './overlay-actions.component';

describe('SheetActionsComponent', () => {
  let component: OverlayActionsComponent;
  let fixture: ComponentFixture<OverlayActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
