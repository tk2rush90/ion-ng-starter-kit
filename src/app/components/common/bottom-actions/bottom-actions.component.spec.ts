import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomActionsComponent } from './bottom-actions.component';

describe('SheetActionsComponent', () => {
  let component: BottomActionsComponent;
  let fixture: ComponentFixture<BottomActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
