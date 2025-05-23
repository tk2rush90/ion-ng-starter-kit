import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueFieldComponent } from './value-field.component';

describe('ValueFieldComponent', () => {
  let component: ValueFieldComponent;
  let fixture: ComponentFixture<ValueFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValueFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ValueFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
