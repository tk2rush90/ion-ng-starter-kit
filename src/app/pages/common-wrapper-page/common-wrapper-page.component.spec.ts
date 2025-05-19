import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonWrapperPageComponent } from './common-wrapper-page.component';

describe('CommonWrapperPageComponent', () => {
  let component: CommonWrapperPageComponent;
  let fixture: ComponentFixture<CommonWrapperPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonWrapperPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonWrapperPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
