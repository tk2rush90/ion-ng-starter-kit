import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayOutletComponent } from './overlay-outlet.component';

describe('OverlayOutletComponent', () => {
  let component: OverlayOutletComponent;
  let fixture: ComponentFixture<OverlayOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayOutletComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
