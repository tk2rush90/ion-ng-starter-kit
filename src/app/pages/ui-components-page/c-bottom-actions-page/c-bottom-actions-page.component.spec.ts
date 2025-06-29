import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBottomActionsPageComponent } from './c-bottom-actions-page.component';

describe('CBottomActionsPageComponent', () => {
  let component: CBottomActionsPageComponent;
  let fixture: ComponentFixture<CBottomActionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CBottomActionsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CBottomActionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
