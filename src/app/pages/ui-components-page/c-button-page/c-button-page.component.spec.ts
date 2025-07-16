import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CButtonPageComponent } from './c-button-page.component';

describe('CButtonPageComponent', () => {
  let component: CButtonPageComponent;
  let fixture: ComponentFixture<CButtonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CButtonPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CButtonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
