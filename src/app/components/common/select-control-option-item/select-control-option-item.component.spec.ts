import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectControlOptionItemComponent } from './select-control-option-item.component';

describe('SelectControlOptionItemComponent', () => {
  let component: SelectControlOptionItemComponent;
  let fixture: ComponentFixture<SelectControlOptionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectControlOptionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectControlOptionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
