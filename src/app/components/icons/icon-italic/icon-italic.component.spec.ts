import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconItalicComponent } from './icon-italic.component';

describe('IconItalicComponent', () => {
  let component: IconItalicComponent;
  let fixture: ComponentFixture<IconItalicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconItalicComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconItalicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
