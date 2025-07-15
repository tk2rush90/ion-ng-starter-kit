import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBottomSheetPageComponent } from './c-bottom-sheet-page.component';

describe('CBottomSheetPageComponent', () => {
  let component: CBottomSheetPageComponent;
  let fixture: ComponentFixture<CBottomSheetPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CBottomSheetPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CBottomSheetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
