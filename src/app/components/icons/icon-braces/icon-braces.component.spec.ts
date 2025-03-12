import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconBracesComponent } from './icon-braces.component';

describe('IconBracesComponent', () => {
  let component: IconBracesComponent;
  let fixture: ComponentFixture<IconBracesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconBracesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconBracesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
