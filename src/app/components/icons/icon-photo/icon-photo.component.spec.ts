import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconPhotoComponent } from './icon-photo.component';

describe('IconPhotoComponent', () => {
  let component: IconPhotoComponent;
  let fixture: ComponentFixture<IconPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconPhotoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
