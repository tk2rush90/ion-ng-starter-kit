import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldHintComponent } from './field-hint.component';

describe('FieldHintComponent', () => {
  let component: FieldHintComponent;
  let fixture: ComponentFixture<FieldHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldHintComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
