import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconFormatListBulletedComponent } from './icon-format-list-bulleted.component';

describe('IconFormatListBulletedComponent', () => {
  let component: IconFormatListBulletedComponent;
  let fixture: ComponentFixture<IconFormatListBulletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconFormatListBulletedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconFormatListBulletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
