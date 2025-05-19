import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconLayoutDashboardComponent } from './icon-layout-dashboard.component';

describe('IconLayoutDashboardComponent', () => {
  let component: IconLayoutDashboardComponent;
  let fixture: ComponentFixture<IconLayoutDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconLayoutDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconLayoutDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
