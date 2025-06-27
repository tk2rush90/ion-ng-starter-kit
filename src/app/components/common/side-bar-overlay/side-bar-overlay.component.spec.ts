import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarOverlayComponent } from './side-bar-overlay.component';

describe('SideBarOverlayComponent', () => {
  let component: SideBarOverlayComponent;
  let fixture: ComponentFixture<SideBarOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBarOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
