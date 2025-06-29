import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CAutoFocusPageComponent } from './c-auto-focus-page.component';

describe('CAutoFocusPageComponent', () => {
  let component: CAutoFocusPageComponent;
  let fixture: ComponentFixture<CAutoFocusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CAutoFocusPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CAutoFocusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
