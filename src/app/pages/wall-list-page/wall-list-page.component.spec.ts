import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallListPageComponent } from './wall-list-page.component';

describe('WallListPageComponent', () => {
  let component: WallListPageComponent;
  let fixture: ComponentFixture<WallListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WallListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WallListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
