import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconXMarkComponent } from './icon-x-mark.component';

describe('IconXMarkComponent', () => {
  let component: IconXMarkComponent;
  let fixture: ComponentFixture<IconXMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconXMarkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconXMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
