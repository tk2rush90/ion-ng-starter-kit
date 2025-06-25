import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetActionsComponent } from './sheet-actions.component';

describe('SheetActionsComponent', () => {
  let component: SheetActionsComponent;
  let fixture: ComponentFixture<SheetActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
