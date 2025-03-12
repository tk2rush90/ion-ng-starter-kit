import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconQuestionMarkCircleComponent } from './icon-question-mark-circle.component';

describe('IconQuestionMarkCircleComponent', () => {
  let component: IconQuestionMarkCircleComponent;
  let fixture: ComponentFixture<IconQuestionMarkCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconQuestionMarkCircleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconQuestionMarkCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
