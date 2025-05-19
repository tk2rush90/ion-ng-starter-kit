import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconPiloLogoComponent } from './icon-pilo-logo.component';

describe('IconPiloLogoComponent', () => {
  let component: IconPiloLogoComponent;
  let fixture: ComponentFixture<IconPiloLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconPiloLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconPiloLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
