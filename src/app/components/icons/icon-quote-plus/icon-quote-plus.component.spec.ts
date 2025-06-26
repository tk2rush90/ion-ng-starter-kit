import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconQuotePlusComponent } from './icon-quote-plus.component';

describe('IconQuotePlusComponent', () => {
  let component: IconQuotePlusComponent;
  let fixture: ComponentFixture<IconQuotePlusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconQuotePlusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconQuotePlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
