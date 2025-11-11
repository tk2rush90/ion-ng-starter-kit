import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectControlOptionOverlayComponent } from './select-control-option-overlay.component';

describe('SelectControlOptionOverlayComponent', () => {
  let component: SelectControlOptionOverlayComponent;
  let fixture: ComponentFixture<SelectControlOptionOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectControlOptionOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectControlOptionOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
